"use strict";
const express = require("express");
const fs = require('fs')
const https = require('https')
const app = express();
const sdk = require("./rainbowSDK/sdk");
const SDKRouter = require("./routes/sdkRouter");
const webRouter = require("./routes/webRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const secretKey = "NSxjiXUqyxYPdcT2Y4y8Dgje3gfUQCxyTNCoEP81vWrhsobuVGjwCsCpqxIMNQUU";
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
			https.createServer({key:fs.readFileSync('server.key'),cert:fs.readFileSync('server.cert')},app).listen(3005,function(){
				console.log("Express is running on port 3005");
			});
			//openssl req -nodes -new -x509 -keyout server.key -out server.cert
			// this.app = app;
			// this.app.listen(3000, function() {
			// 	console.log("Express is running on port 3000");
			// });
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
