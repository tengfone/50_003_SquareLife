const RainbowSDK = require("rainbow-node-sdk");
const options = require("./config");

class SDK {
	constructor() {
		this.rainbowSDK = null;
	}

	start() {
		this.rainbowSDK = new RainbowSDK(options);
		this.rainbowSDK.events.on("rainbow_ondisconnected", data => {
			console.log(
				"SDK - rainbow_ondisconnected - attempting to reconnect",
				data
			);
		});
		this.rainbowSDK.events.on("rainbow_onfailed", () => {
			this.forceRestart().then(data => console.log(data));
		});
		return this.rainbowSDK.start().then(() => {
			return "SDK Started";
		});
	}

	forceRestart() {
		return new Promise((resolve, reject) => {
			this.rainbowSDK.events.once("rainbow_onstopped", data => {
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
		return this.nodeSDK.state;
	}

	get version() {
		return this.nodeSDK.version;
	}

	get sdk() {
		return this.nodeSDK;
	}
}

module.exports = new SDK();
