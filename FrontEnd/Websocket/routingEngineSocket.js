const WebSocket = require("ws");

/*
  TO BE IGNORED
*/

function handleError(fn) {
  return function (...params) {
    return fn(...params).catch(function (err) {
      console.error("Oops! Something went wrong.", err);
    });
  };
}

class RoutingEngineSocket {
  constructor(webSocketAddress = null) {
    this.socket = null;
    this.webSocketAddress = webSocketAddress;
    this.open = false;
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
    return this.waitForConnection();
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
          resolve(this.start());
        });
    });
  }

  send(message) {
    return new Promise((resolve, reject) => {
      if (!this.open) reject("Connection closed");
      this.socket.send(message);
      this.socket.once("message", (message) => {
        let response = JSON.parse(message);
        if (response.result == "success") {
          resolve(response.payload);
        } else {
          reject(response.payload);
        }
      });
    });
  }
}

module.exports = RoutingEngineSocket;
