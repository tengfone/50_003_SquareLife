const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const port = 5000;
app.get("/", (req, res) => {
	res.render(path.join(__dirname + "public" + "/index.html"));
});
app.listen(port, () => console.log(`Server is running on port ${port}`));
