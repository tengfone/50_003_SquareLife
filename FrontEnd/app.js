"use strict";
const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();
const sdk = require("./rainbowSDK/sdk");
const SDKRouter = require("./routes/SDKRouter");
const webRouter = require("./routes/webRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const secretKey =
	"NSxjiXUqyxYPdcT2Y4y8Dgje3gfUQCxyTNCoEP81vWrhsobuVGjwCsCpqxIMNQUU";
const bodyParser = require("body-parser");
// const routingEngineSocket = require("./Websocket/routingEngineSocket");
let options = { maxAge: 1000 * 60 * 5, httpOnly: true, signed: true };

class WebApp {
	constructor() {
		this.app = null;
		this.sdk = sdk;
		/*
			IGNORE ALL WEBSOCKETS FOR THE MOMENT
			this.routingEngineSocket = new routingEngineSocket("ws://localhost:4000/");
		*/
	}

	async start(port = 3005) {
		console.log("SDK Starting");
		let result = await this.sdk.start();
		console.log(result);
		this.initializeApp(this.sdk);
		this.app = app;
		https
			.createServer(
				{
					key: fs.readFileSync("server.key"),
					cert: fs.readFileSync("server.cert")
				},
				app
			)
			.listen(port, function() {
				console.log(`Express is running on port ${port}`);
			});
		//openssl req -nodes -new -x509 -keyout server.key -out server.cert
		// this.routingEngineSocket.start();
	}

	initializeApp(sdk) {
		const sdkRouter = new SDKRouter(sdk);
		app.use(cookieParser(secretKey, options));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use("/sdk", sdkRouter.router);
		app.use("/", webRouter);
		app.use("/public", express.static(path.join(__dirname, "public")));
		app.set("views", __dirname + "/views");
		app.set("view engine", "ejs");
		app.engine("html", require("ejs").renderFile);
	}
}

module.exports = new WebApp();
