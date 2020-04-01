const WebSocket = require("ws");

/*
  TO BE IGNORED
*/

class RoutingEngineSocket {
	constructor(webSocketAddress = null) {
		this.socket = null;
		this.webSocketAddress = webSocketAddress;
		this.open = false;
	}

	/*
    TODO
    Iterate through list of agents using a predefined list (file)
    Create the agents in the routing engine and save the details locally (memory/file)
  */
	async sendAgentDetails() {
		let agentDetails = {};
		try {
			for (let i = 0; i < 4; i++) {
				agentDetails[`agent${i}`] = await this.send(
					"new_agent {skills:{1:true, 2:true}}"
				);
			}
		} catch (err) {
			console.log(err);
		}
		console.log(agentDetails);
		return agentDetails;
	}

	async initialise() {
		try {
			await this.start();
			this.sendAgentDetails();
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
					reject("Connection error");
				});
		});
	}

	send(message) {
		return new Promise((resolve, reject) => {
			if (!this.open) reject("Connection closed");
			this.socket.send(message);
			this.socket.once("message", message => {
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
