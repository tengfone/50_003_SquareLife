const RainbowSDK = require("rainbow-node-sdk");
const options = require("./config");
const RoutingEngineSocket = require("../Websocket/routingEngineSocket");

class SDK {
  constructor() {
    this.rainbowSDK = null;
    this.socket = null;
  }

  async start() {
    this.rainbowSDK = new RainbowSDK(options);
    this.setListeners();
    this.socket = new RoutingEngineSocket("ws://localhost:4000/");
    // let socketPromise = this.socket.start();
    let socketPromise = null;
    let sdkPromise = this.rainbowSDK.start();
    await Promise.all([sdkPromise, socketPromise]);
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

    this.rainbowSDK.events.on(
      "rainbow_oncontactpresencechanged",
      async (contact) => {
        let rainbowID = contact.id;
        let presence = contact.presence;
        console.log(rainbowID, presence);
        await this.socket.send(
          `update_agent_availability {uuid:"${rainbowID}", available:${
            presence == "online"
          }}`
        );
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
            await this.socket.send(
              `close_support_request {uuid:"${rainbowID}"}`
            );
            break;

          case "//reassignagent":
            await this.socket.send(
              `drop_support_request {uuid:"${rainbowID}"}`
            );
            break;
        }
      }
    });
  }
}

module.exports = new SDK();
