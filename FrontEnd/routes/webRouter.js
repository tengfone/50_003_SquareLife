const express = require("express");
const router = express.Router();
const uuid = require("uuid");

router.get("/", (req, res) => {
	// do not add a var here
	let data = [
		{ id: 1, name: "Check Bill" },
		{ id: 2, name: "Check Promotions" },
		{ id: 3, name: "Others" }
	];

	console.log(req.signedCookies);
	if (req.signedCookies.AppName == undefined) {
		res.cookie("AppName", uuid.v4(), { signed: true });
	}
	res.render("index", { data: data });
});

router.post("/submitted", (req, res) => {
	console.log(req.body);
	const customer_option = req.body["customer_option"];
	const firstName = req.body["firstname"];
	const lastName = req.body["lastname"];
	const customer_email = req.body["customer_email"];

	// Cookie
	console.log(req.signedCookies.AppName);

	res.render("index-success", {
		customer_option: customer_option,
		firstName: firstName,
		lastName: lastName,
		customer_email: customer_email
	});
});

module.exports = router;
