import rainbowSDK from "./rainbow-sdk.min.js";

let selectedContact = null;
const applicationID = "6095e9a0594e11eabf7e77d14e87b936";
const applicationSecret =
	"NSxjiXUqyxYPdcT2Y4y8Dgje3gfUQCxyTNCoEP81vWrhsobuVGjwCsCpqxIMNQUU";
let id = null;
let associatedConversation = null;

// TODO 'User is typing' UI implmentation
// TODO WebSocket Implementation

function onReady() {
	console.log("[RainbowWebSDK] :: On SDK Ready !");
}

function onLoaded() {
	console.log("[RainbowWebSDK] :: On SDK Loaded !");
	initRainbowSDK();
}

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);

rainbowSDK.start();
rainbowSDK.load();

// Ideally to call when client receives an id from the routing engine
async function initRainbowSDK() {
	let initSDK = rainbowSDK.initialize(applicationID, applicationSecret);
	let request = new Request("https://localhost:3000/sdk/makeaccount", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			firstName: firstName,
			lastName: lastName,
			customer_option: customer_option,
			customer_email: customer_email
		})
	});
	let getCredentials = fetch(request);
	try {
		let resolvedValues = await Promise.allSettled([initSDK, getCredentials]);
		let credentials = await resolvedValues[1].value.json();
		await rainbowSDK.connection.signin(
			credentials.loginEmail,
			credentials.password
		);
		console.log("logged in");
	} catch (err) {
		console.log(err);
	}
}

// To be called when client receives id from routing engine
async function initChat(id) {
	try {
		let contact = await getContact(id);
		let conversation = await rainbowSDK.conversations.openConversationForContact(
			contact
		);
		associatedConversation = conversation;
		initUI();
	} catch (err) {
		console.log(err);
	}
}

function getContact(id) {
	return rainbowSDK.contacts
		.searchById(id)
		.then(contact => {
			return new Promise((resolve, reject) => {
				if (contact) {
					console.log("Contact found");
					resolve(contact);
				} else {
					reject("Contact not found");
				}
			});
		})
		.catch(function(err) {
			//Something when wrong with the server. Handle the trouble here
			console.log(err);
		});
}

function initUI(conversation) {
	/* VOICE SUPPORT */
	document.getElementById("voiceChat").addEventListener("click", () => {
		callinit();
	});

	document.getElementById("submitmsg").addEventListener("click", () => {
		message = document.getElementById("usermsg").value;
		document.getElementById("usermsg").value = "";
		rainbowSDK.im.sendMessageToConversation(conversation, message);
		addMessage(firstName + " " + lastName, message, "right");
	});

	document.getElementById("usermsg").addEventListener("keydown", key => {
		if (key.keyCode == 13) {
			message = document.getElementById("usermsg").value;
			document.getElementById("usermsg").value = "";
			rainbowSDK.im.sendMessageToConversation(conversation, message);
			addMessage(firstName + " " + lastName, message, "right");
		}
	});
	document.addEventListener(
		rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
		event => {
			let message = event.detail.message;
			let conversation = event.detail.conversation;

			//COMMANDS
			if (message.data == "//endchat") {
				let message2 = "The chat session will now be closed.";

				//send data to routing engine that chat is closed so that new user can be reassigned to the agent

				addMessage(
					selectedContact.firstname + " " + selectedContact.lastname,
					message2,
					"left"
				);
			}

			if (message.data == "//reassignagent") {
				//pull&store data on which agent

				//send data to routing engine

				let message2 = "We will now be reassigning another agent to you.";

				addMessage(
					selectedContact.firstname + " " + selectedContact.lastname,
					message2,

					"left"
				);
			} else {
				console.log(message);
				rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);

				addMessage(
					selectedContact.firstname + " " + selectedContact.lastname,
					message.data,
					"left"
				);
			}

			// Do something with the new message received
		}
	);
	rainbowSDK.im.sendMessageToConversation(
		conversation,
		"The session has begun with " + customer_email
	);
	document.getElementById("usermsg").disabled = false;
	let submitbtn = document.getElementById("submitmsg");
	submitbtn.removeChild(document.getElementById("loadanimation"));
	submitbtn.innerHTML = "Send";
	submitbtn.disabled = false;

	document.getElementById("voiceChat").disabled = false;
	let voiceChatbtn = document.getElementById("voiceChat");
	voiceChatbtn.removeChild(document.getElementById("loadanimation"));
	voiceChatbtn.innerHTML = "Voice Chat";
	voiceChatbtn.disabled = false;
}

function addMessage(name, message, side) {
	let div = document.createElement("div");
	let heading3 = document.createElement("h3");
	let para = document.createElement("p");
	heading3.appendChild(document.createTextNode(message));
	para.appendChild(document.createTextNode(name));
	if (side == "right") {
		heading3.className = "text-right";
		para.className = "text-right text-muted mb-n1";
	} else if (side == "left") {
		heading3.className = "text-left";
		para.className = "text-left text-muted mb-n1";
	}
	div.appendChild(para);
	div.appendChild(heading3);
	document
		.getElementById("chatlog")
		.appendChild(div)
		.scrollIntoView({ behavior: "smooth", block: "end" });
}

// // TO PUT IN CALL.JS
function callinit() {
	if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
		/* Your browser is compliant: You can make audio and video call using WebRTC in your application */
		console.log("Browser supported");
	} else {
		/* Your browser is not compliant: Do not propose audio and video call in your application */
		console.log("Browser not supported");
	}

	/* Call this method to know if a microphone is detected */
	if (rainbowSDK.webRTC.hasAMicrophone()) {
		/* A microphone is available, you can make at least audio call */
		console.log("Has Microphone");
	} else {
		/* No microphone detected */
		console.log("No Microphone");
	}
	/* Ask the user to authorize the application to access to the media devices */
	navigator.mediaDevices
		.getUserMedia({ audio: true, video: false })
		.then(function(stream) {
			/* Stream received which means that the user has authorized the application to access to the audio and video devices. Local stream can be stopped at this time */
			stream.getTracks().forEach(function(track) {
				track.stop();
			});

			/*  Get the list of available devices */
			navigator.mediaDevices
				.enumerateDevices()
				.then(function(devices) {
					/* Do something for each device (e.g. add it to a selector list) */
					devices.forEach(function(device) {
						if (device.deviceId == "default") {
							console.log(device);
						}
					});
				})
				.catch(function(error) {
					/* In case of error when enumerating the devices */
					console.log("Error enum devices");
				});
		})
		.catch(function(error) {
			/* In case of error when authorizing the application to access the media devices */
			console.log("Error Authorizing Application to access media devices");
		});

	/* Select the microphone to use */
	rainbowSDK.webRTC.useMicrophone("default");
	/* Select the speaker to use */
	rainbowSDK.webRTC.useSpeaker("default");

	/* Call this API to call a contact using only audio stream*/
	let res = rainbowSDK.webRTC.callInAudio(selectedContact);

	if (res.label === "OK") {
		document.getElementById("p1").innerHTML =
			"Please Wait For Agent To Pick Up...";
		console.log("Dialing To Agent");
	}
	document.addEventListener(
		rainbowSDK.webRTC.RAINBOW_ONWEBRTCERRORHANDLED,
		onWebRTCErrorHandled
	);
	document.addEventListener(
		rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED,
		onWebRTCCallChanged
	);
}

function onWebRTCCallChanged(event) {
	/* Listen to WebRTC call state change */
	let call = event.detail;

	console.log("OnWebRTCCallChanged event", event.detail.status.value);
	let close_btn = document.getElementById("close_btn");

	function terminateCall() {
		let res = rainbowSDK.webRTC.release(call);
	}

	if (call.status.value == "active") {
		document.getElementById("p1").innerHTML = "Connected";
		close_btn.addEventListener("click", terminateCall);

		console.log("Connected");
	} else if (event.detail.status.value == "Unknown") {
		document.getElementById("p1").innerHTML = "Call Terminated";
	} else if (event.detail.status.value == "dialing") {
		close_btn.addEventListener("click", terminateCall);
	}
}

function onWebRTCErrorHandled(event) {
	let errorSDK = event.detail;
	console.log("WebRTC ERROR: ", errorSDK);
}
