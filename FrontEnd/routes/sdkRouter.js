const express = require("express");
const router = express.Router();
const agentIds = require("..//rainbowSDK//agentIds");

class SDKRouter {
	constructor(sdk) {
		this.sdk = sdk;
		this.defineRoutes();
		this.router = router;
	}

	defineRoutes() {
		// Restart SDK if needed - for debugging purpose
		router.post("/forcerestart", (req, res) => {
			this.sdk
				.forceRestart()
				.then(() => {
					res.status(200).send({ code: 0, message: "sdk restarted" });
				})
				.catch(err => {
					res.status(500).send({
						code: -1,
						message: "Error when restarting the SDK",
						error: err
					});
				});
		});

		// Get SDK Node status
		router.get("/status", (req, res) => {
			res.status(200).send({
				code: 0,
				data: { status: this.sdk.state, version: this.sdk.version }
			});
		});

		/**
		 * Custom Routes
		 */

		router.post("/makeaccount", (req, res) => {
			console.log(req.body);
			const language = "en-US";
			const ttl = 60 * 10;
			this.sdk.rainbowSDK.admin
				.createGuestUser(
					req.body.firstName,
					req.body.lastName,
					language,
					ttl
				)
				.then(guest => {
					console.log({
						loginEmail: guest.loginEmail,
						password: guest.password
					});
					res.json({
						loginEmail: guest.loginEmail,
						password: guest.password,
						agentId: agentIds[req.body.customer_option].id
					});
					res.end();
				})
				.catch(err => {
					console.log(err);
				});
		});
	}
}

module.exports = SDKRouter;
