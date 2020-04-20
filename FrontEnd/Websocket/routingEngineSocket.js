const WebSocket = require("ws");
const events = require("events");
const HelperFuncs = require("../helperFunc");
const timeout = HelperFuncs.timeout;

class RoutingEngineSocket {
  constructor(webSocketAddress = null) {
    this.socket = null;
    this.webSocketAddress = webSocketAddress;
    this.open = false;
    this.eventEmitter = new events.EventEmitter();
    this.buffer = {};
    this.counter = 0;
  }

  async initialise() {
    try {
      await this.start();
    } catch (err) {
      console.log(err);
    }
  }

  async start() {
    this.socket = new WebSocket(this.webSocketAddress);
    await this.waitForConnection();
    this.socket.on("message", (message) => {
      let response = JSON.parse(message);
      let ticketNumber = response.ticket_number;
      if (ticketNumber in this.buffer) {
        this.eventEmitter.emit(ticketNumber, response);
      } else {
        this.buffer[ticketNumber] = new Promise((res, rej) => {
          if (response.result == "pending") {
            this.eventEmitter.once(ticketNumber, (response) => {
              this.counter--;
              res(response);
            });
          } else {
            this.counter--;
            res(response);
          }
        });
      }
      // console.log(this.buffer);
    });
  }

  waitForConnection() {
    return new Promise((resolve, reject) => {
      this.socket
        .once("open", () => {
          console.log("Connection open");
          this.open = true;
          resolve();
        })
        .once("close", () => {
          console.log("Connection closed");
          this.open = false;
        })
        .once("error", () => {
          console.log("Error");
        });
    });
  }

  send(message, recurse = false) {
    return new Promise((res, rej) => {
      if (!this.open) reject("Connection closed");
      this.socket.send(message);
      this.counter++;
    });
  }

  popResult(ticketNumber) {
    let result = this.buffer[ticketNumber];
    delete this.buffer[ticketNumber];
    return result;
  }

  clearBuffer() {
    this.buffer = {};
  }

  waitCounter() {
    let that = this;
    return new Promise(async (res, rej) => {
      (function attempt() {
        if (that.counter == 0) {
          res();
        } else {
          setTimeout(attempt, 1500);
        }
      })();
    });
  }

  getBuffer() {
    console.log(this.buffer);
    return this.buffer;
  }
}

module.exports = RoutingEngineSocket;
