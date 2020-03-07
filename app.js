"use strict";
const express = require("express");
const app = express();
const sdk = require("./rainbowSDK/sdk");
const SDKRouter = require("./routes/sdkRouter");
const webRouter = require("./routes/webRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const secretKey = "4f895a469188cd1a693909cdd94f54e9";
const bodyParser = require("body-parser");
let options = { maxAge: 1000 * 60 * 5, httpOnly: true, signed: true };

class WebApp {
	constructor() {
		this.app = null;
		this.sdk = sdk;
	}

	start() {
		console.log("SDK Starting");
		this.sdk.start().then(result => {
			console.log(result);
			this.initializeApp(this.sdk);
			this.app = app;
			this.app.listen(3000, function() {
				console.log("Express is running on port 3000");
			});
		});
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
