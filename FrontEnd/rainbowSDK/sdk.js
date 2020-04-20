const RainbowSDK = require("rainbow-node-sdk");
const options = require("./config");
const RoutingEngineSocket = require("../Websocket/routingEngineSocket");
const agentIds = require("./agentIds");
const admin = require("./secrets").admin;
const supportRequestTypes = require("./secrets").types;

class SDK {
  constructor() {
    this.rainbowSDK = null;
    this.socket = null;
    this.availableAgents = [...Object.values(agentIds)];
    this.unavailableAgents = [];
    this.limboAgents = {};
  }

  async start() {
    this.rainbowSDK = new RainbowSDK(options);
    this.setListeners();
    this.socket = new RoutingEngineSocket("ws://localhost:4000/");
    let socketPromise = this.socket.start();
    let sdkPromise = this.rainbowSDK.start();
    // let socketPromise = null;
    // let sdkPromise = null;
    await Promise.all([sdkPromise, socketPromise]);
    await this.initAgents();
    this.checkQueue();
    this.checkUnavailableAgents();
    this.setBotListeners();
    return "SDK Started";
  }

  forceRestart() {
    return new Promise((resolve, reject) => {
      this.rainbowSDK.events.once("rainbow_onstopped", (data) => {
        console.log(
          "SDK - rainbow_onstopped - rainbow event received. data",
          data
        );
        this.rainbowSDK.start().then(() => {
          resolve("SDK has restarted");
        });
      });

      this.rainbowSDK.stop();
    });
  }

  get state() {
    return this.rainbowSDK.state;
  }

  get version() {
    return this.rainbowSDK.version;
  }

  get sdk() {
    return this.rainbowSDK;
  }

  setListeners() {
    this.rainbowSDK.events.on("rainbow_ondisconnected", (data) => {
      console.log(
        "SDK - rainbow_ondisconnected - attempting to reconnect",
        data
      );
    });

    this.rainbowSDK.events.on("rainbow_onfailed", () => {
      this.forceRestart().then((data) => console.log(data));
    });
  }

  setBotListeners() {
    this.rainbowSDK.events.on(
      "rainbow_oncontactpresencechanged",
      async (contact) => {
        let rainbowID = contact.id;
        let presence = contact.presence;
        console.log(rainbowID, presence);
        if (presence == "away") return;
        //
        this.socket.send(
          `update_agent_availability {rainbow_id:"${rainbowID}", available:${
            presence == "online"
          }}`
        );
        await this.socket.waitCounter();
        let values = await Promise.all(Object.values(this.socket.buffer));
        for (let i = 0; i < values.length; i++) {
          if (values[i].method == "update_agent_availability") {
            let ticket = await this.socket.popResult(values[i].ticket_number);
            if (ticket.result == "success") {
              let available = ticket.payload.available;
              if (available) {
                let pushItem = this.removeAgentFromUnavailable(rainbowID);
                if (pushItem) {
                  for (let skill in pushItem.skills) {
                    this.availableAgents[skill].push(pushItem);
                  }
                  console.log("Available agents: ", this.availableAgents);
                }
              } else {
                let pushItem = this.removeAgentFromAvailable(rainbowID);
                if (pushItem) this.unavailableAgents.push(pushItem);
                console.log("Unavailable agents: ", this.unavailableAgents);
              }
            }
            break;
          }
        }
      }
    );

    this.rainbowSDK.events.on("rainbow_onmessagereceived", async (message) => {
      if (message.type === "chat") {
        let rainbowJID = message.fromJid;
        let rainbowID = "";
        try {
          let contact = await this.rainbowSDK.contacts.getContactByJid(
            rainbowJID
          );
          rainbowID = contact.id;
        } catch (err) {}

        switch (message.content) {
          case "//endchat":
            this.socket.send(
              `drop_support_request {rainbow_id:"${rainbowID}"}`
            );
            break;

          case "//reassignagent":
            this.socket.send(
              `drop_support_request {rainbow_id:"${rainbowID}"}`
            );
            break;
        }
      }
    });
  }

  removeAgentFromUnavailable(rainbow_id) {
    let result = false;
    for (let i = 0; i < this.unavailableAgents.length; i++) {
      if (this.unavailableAgents[i].rainbow_id == rainbow_id) {
        let agentTemp = this.unavailableAgents[i];
        this.unavailableAgents.splice(i, 1);
        result = agentTemp;
        break;
      }
    }
    return result;
  }

  removeAgentFromAvailable(rainbow_id) {
    let agent = agentIds[rainbow_id];
    let result = false;
    for (let skill in agent.skills) {
      for (let i = 0; i < this.availableAgents[skill].length; i++) {
        if (rainbow_id == this.availableAgents[skill][i].rainbow_id) {
          let agentTemp = this.availableAgents[skill][i];
          this.availableAgents[skill].splice(i, 1);
          result = agentTemp;
          break;
        }
      }
    }
    return result;
  }

  async initAgents() {
    for (let i in agentIds) {
      let rainbowID = agentIds[i].rainbow_id;
      let skills = JSON.stringify(agentIds[i].skills);
      this.socket.send(
        `new_agent {rainbow_id: ${rainbowID}, skills:${skills}, admin_uuid: ${admin.uuid}}`
      );
    }
    // await this.socket.waitCounter();
    // let values = await Promise.all(Object.values(this.socket.buffer));
    // this.socket.clearBuffer();
    // values.forEach((item, index) => {
    //   // this.availableAgents[index].uuid = item.payload.uuid;
    //   this.socket.send(
    //     `update_agent_availability {rainbow_id:${item.payload.rainbow_id}, available:true}`
    //   );
    // });
    await this.socket.waitCounter();
    let values = await Promise.all(Object.values(this.socket.buffer));
    this.socket.clearBuffer();
    values.forEach((item, index) => {
      this.availableAgents[index].requestCount = 0;
      this.unavailableAgents.push(this.availableAgents[index]);
    });
    let temp = {};
    for (let i = 0; i < supportRequestTypes.length; i++) {
      temp[supportRequestTypes[i]] = [];
    }
    // for (let i = 0; i < this.availableAgents.length; i++) {
    //   let agent = this.availableAgents[i];
    //   for (let skill in agent.skills) {
    //     if (agent.skills[skill] == true) {
    //       if (temp[skill] == undefined) {
    //         temp[skill] = [];
    //       }
    //       temp[skill].push(agent);
    //     }
    //   }
    // }
    this.availableAgents = temp;
    console.log(this.availableAgents);
  }

  async checkQueue(recurse = true) {
    this.socket.send(`get_queue_status {admin_uuid: ${admin.uuid}}`);
    await this.socket.waitCounter();
    let values = await Promise.all(Object.values(this.socket.buffer));
    let queues;
    for (let i = 0; i < values.length; i++) {
      if (values[i].method == "get_queue_status") {
        this.socket.popResult(values[i].ticket_number);
        queues = values[i].payload;
        break;
      }
    }
    let agentAssigned = false;
    for (let queueType in queues) {
      let queue = queues[queueType];
      console.log(`${queueType}: ${queue.count}`);
      for (let i = 0; i < queue.count; i++) {
        await this.assignAgent(queueType);
        agentAssigned = true;
      }
    }
    console.log("");
    if (agentAssigned) await this.checkLimboAgents();
    if (recurse) setTimeout(this.checkQueue.bind(this), 5000);
  }

  async assignAgent(type) {
    console.log("Assigning agent");
    if (this.availableAgents[type].length == 0) return;
    let agent = this.availableAgents[type].shift();
    for (let skill in agent.skills) {
      if (skill != type) {
        this.availableAgents[skill] = this.availableAgents[skill].filter(
          (item) => {
            return item != agent;
          }
        );
      }
    }
    this.socket.send(`take_support_request {rainbow_id: ${agent.rainbow_id}}`);
    this.limboAgents[agent.rainbow_id] = agent;
  }

  async checkUnavailableAgents(recurse = true) {
    console.log("Checking unavailable agents");
    for (let i = 0; i < this.unavailableAgents.length; i++) {
      this.socket.send(
        `check_agent {rainbow_id:${this.unavailableAgents[i].rainbow_id}}`
      );
    }
    await this.socket.waitCounter();
    let values = await Promise.all(Object.values(this.socket.buffer));
    for (let i = 0; i < values.length; i++) {
      if (values[i].method == "check_agent") {
        this.socket.popResult(values[i].ticket_number);
        for (let j = 0; j < this.unavailableAgents.length; j++) {
          if (
            this.unavailableAgents[j].rainbow_id == values[i].payload.rainbow_id
          ) {
            if (values[i].payload.available == true) {
              let agent = this.unavailableAgents[j];
              this.unavailableAgents.splice(j, 1);
              for (let skill in agent.skills) {
                if (agent.skills[skill] == true) {
                  this.availableAgents[skill].push(agent);
                }
              }
            }
            break;
          }
        }
      }
    }
    console.log("Unavailable agent: ", this.unavailableAgents);
    if (recurse) setTimeout(this.checkUnavailableAgents.bind(this), 30000);
  }

  async checkLimboAgents() {
    await this.socket.waitCounter();
    let values = await Promise.all(Object.values(this.socket.buffer));
    for (let i = 0; i < values.length; i++) {
      if (values[i].method == "take_support_request") {
        this.socket.popResult(values[i].ticket_number);
        if (values[i].result == "success") {
          let agent = this.limboAgents[values[i].payload.rainbow_id];
          agent.requestCount++;
          this.unavailableAgents.push(agent);
          console.log(this.unavailableAgents);
          delete this.limboAgents[values[i].rainbow_id];
        }
      }
    }
  }
}

module.exports = new SDK();
