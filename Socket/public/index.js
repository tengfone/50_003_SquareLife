import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js";
import options from "./options.js";
const URL = "ws://localhost:4000/";
let responseArea;

let UUID = null;

let form = new Vue({
	el: "#form",
	data: {
		options: options
	},
	methods: {
		replaceUUID: event => {
			let element = event.target;
			element.value = element.value.replace("(uuid)", UUID);
		}
	}
});

const copyToClipBoard = str => {
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
};

let addResponse = response => {
	let div = document.createElement("div");
	let pre = document.createElement("pre");
	pre.textContent = JSON.stringify(JSON.parse(response), undefined, 2);
	console.log(UUID);
	pre.innerHTML = pre.innerHTML.replace(
		UUID.toString(),
		`<span class="copy">${UUID.toString()}</span>`
	);
	pre.getElementsByClassName("copy")[0].addEventListener("click", event => {
		copyToClipBoard(pre.getElementsByClassName("copy")[0].innerHTML);
		$(".toast").toast("show");
	});
	div.appendChild(pre);
	div.className = "container";
	responseArea
		.appendChild(div)
		.scrollIntoView({ behavior: "smooth", block: "end" });
};
document.onreadystatechange = function() {
	if (document.readyState === "complete") {
		initApplication();
	}
};

let initApplication = () => {
	responseArea = document.getElementById("responseArea");
	const submitButton = document.getElementById("submitfield");
	submitButton.addEventListener("click", () => {
		let content = document.getElementById("inputfield").value;
		socket.send(content);
		document.getElementById("inputfield").value = "";
	});
	const inputField = document.getElementById("inputfield");
	inputField.onkeypress = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
			socket.send(inputField.value);
			inputField.value = "";
		}
	};
	$(".toast").toast({ delay: 1500 });
};

let socket = new WebSocket(URL);
socket.addEventListener("message", event => {
	console.log(event.data);
	let data = JSON.parse(event.data);
	if (data.result === "success") {
		if (data.payload.uuid != undefined) {
			UUID = data.payload.uuid;
		}
	}
	addResponse(event.data);
});
socket.addEventListener("open", event => {
	console.log("Connection has been opened");
});

socket.addEventListener("close", event => {
	console.log("Connection has been closed.");
});
