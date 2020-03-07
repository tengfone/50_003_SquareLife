let selectedContact = null;
const applicationID = "f80b16d05add11eabf7e77d14e87b936";
const applicationSecret =
	"tOgnZXQd5m4691Z10s0Rk1cYGf3aNC0Bv7s9t9AWws2ZIH6P0UA9kRZ9fqm9tCcN";
let id = null;

// #TODO Put setContact and setConvo into 1 async function
// #TODO 'User is typing' UI implmentation
function setContact() {
	rainbowSDK.contacts
		.searchById(id)
		.then(function(contact) {
			selectedContact = contact;
			if (selectedContact) {
				// Ok, we have the contact object
				console.log("Contact Found");
				setConvo();
			} else {
				// Strange, no contact with that Id. Are you sure that the id is correct?
				console.log("No contact found");
			}
		})
		.catch(function(err) {
			//Something when wrong with the server. Handle the trouble here
			console.log(err);
		});
}
let associatedConversation = null;
function setConvo() {
	rainbowSDK.conversations
		.openConversationForContact(selectedContact)
		.then(function(conversation) {
			associatedConversation = conversation;
			console.log("Convo Found");
			document
				.getElementById("submitmsg")
				.addEventListener("click", () => {
					message = document.getElementById("usermsg").value;
					document.getElementById("usermsg").value = "";
					rainbowSDK.im.sendMessageToConversation(
						conversation,
						message
					);
					addMessage(firstName + " " + lastName, message, "right");
				});
			document
				.getElementById("usermsg")
				.addEventListener("keydown", key => {
					if (key.keyCode == 13) {
						message = document.getElementById("usermsg").value;
						document.getElementById("usermsg").value = "";
						rainbowSDK.im.sendMessageToConversation(
							conversation,
							message
						);
						addMessage(
							firstName + " " + lastName,
							message,
							"right"
						);
					}
				});
			document.addEventListener(
				rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
				event => {
					let message = event.detail.message;
					let conversation = event.detail.conversation;

					// Do something with the new message received
					console.log(message);
					rainbowSDK.im.markMessageFromConversationAsRead(
						conversation,
						message
					);
					addMessage(
						selectedContact.firstname +
							" " +
							selectedContact.lastname,
						message.data,
						"left"
					);
				}
			);
			rainbowSDK.im.sendMessageToConversation(
				conversation,
				"The session has begun."
			);
			document.getElementById("usermsg").disabled = false;
			let submitbtn = document.getElementById("submitmsg");
			submitbtn.removeChild(document.getElementById("loadanimation"));
			submitbtn.innerHTML = "Send";
			submitbtn.disabled = false;
		})
		.catch(function(err) {
			//Something when wrong with the server. Handle the trouble here
			console.log(err);
		});
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

$(function() {
	console.log("[DEMO] :: Rainbow Application started!");

	/* Bootstrap the SDK */
	angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

	/* Callback for handling the event 'RAINBOW_ONREADY' */
	var onReady = function onReady() {
		console.log("[DEMO] :: On SDK Ready !");
		// do something when the SDK is ready

		info = {
			firstName: firstName,
			lastName: lastName,
			customer_option: customer_option
		};
		// POST Req to generate guest account
		$.post(
			"http://localhost:3000/sdk/makeaccount",
			info,
			(data, status) => {
				id = data.agentId;
				rainbowSDK.connection
					.signin(data.loginEmail, data.password)
					.then(account => {
						// Successfully signed to Rainbow and the SDK is started completely. Rainbow data can be retrieved.
						console.log("Account successfully logged in");
						setContact();
					})
					.catch(err => {
						// An error occurs (e.g. bad credentials). Application could be informed that sign in has failed
						// console.log(err);
					});
			}
		);
	};

	/* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
	var onLoaded = function onLoaded() {
		console.log("[DEMO] :: On SDK Loaded !");

		// Activate full SDK log
		rainbowSDK.setVerboseLog(true);

		rainbowSDK
			.initialize(applicationID, applicationSecret)
			.then(function() {
				console.log("[DEMO] :: Rainbow SDK is initialized!");
			})
			.catch(function(err) {
				console.log(
					"[DEMO] :: Something went wrong with the SDK...",
					err
				);
			});
	};

	/* Listen to the SDK event RAINBOW_ONREADY */
	document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady, {
		once: true
	});

	/* Listen to the SDK event RAINBOW_ONLOADED */
	document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded, {
		once: true
	});

	/* Load the SDK */
	rainbowSDK.load();
});
