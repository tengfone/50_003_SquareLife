import rainbowSDK from "./rainbow-sdk.min.js";

let contact = null;
const APPLICATION_ID = "6095e9a0594e11eabf7e77d14e87b936";
const APPLICATION_SECRET =
  "NSxjiXUqyxYPdcT2Y4y8Dgje3gfUQCxyTNCoEP81vWrhsobuVGjwCsCpqxIMNQUU";
let agentId = null;
let associatedConversation = null;
let socket, agentUUID, clientUUID;
let userDLChatLog = ["Welcome To SquareLife Chat Log"];
let closeBoolean = false;
const timeoutinSeconds = 5 * 60;

document.addEventListener("DOMContentLoaded", handleError(onDOMLoaded));

function handleError(fn) {
  return function (...params) {
    return fn(...params).catch(function (err) {
      console.error("Oops! Something went wrong.", err);
    });
  };
}

async function onDOMLoaded() {
  await loadRainbowSDK();
  await Promise.all([initRainbowSDK(), initSocketConnection()]);
  initChat();
}

async function initSocketConnection() {
  const WEBSOCKET_URL = "ws://localhost:4000/";
  socket = new WebSocket(WEBSOCKET_URL);
  let waitForConnection = new Promise((resolve, reject) => {
    socket.addEventListener(
      "open",
      (event) => {
        console.log("Connection has been opened");
        resolve();
      },
      { once: true }
    );
    socket.addEventListener("close", (event) => {
      console.log("Connection has been closed.");
    });
  });
  await waitForConnection;
  clientUUID = await sendSupportRequest();
  [agentId, agentUUID] = await waitForAgent();
  console.log(agentId);
}

function sendSupportRequest() {
  return new Promise((resolve, reject) => {
    socket.send(
      `new_support_request {name:"${
        firstName + lastName
      }", email:"${customer_email}", type:${customer_option}}`
    );
    socket.addEventListener(
      "message",
      (event) => {
        let response = JSON.parse(event.data);
        console.log(response);
        if (response.result == "success") {
          resolve(response.payload.uuid);
        } else if (response.result == "pending") {
          resolve(
            (() => {
              return new Promise((resolve, reject) => {
                socket.addEventListener(
                  "message",
                  (event) => {
                    let response = JSON.parse(event.data);
                    console.log(response);
                    if (response.result == "success") {
                      resolve(response.payload.uuid);
                    } else {
                      resolve(sendSupportRequest());
                    }
                  },
                  { once: true }
                );
              });
            })()
          );
        } else {
          resolve(sendSupportRequest());
        }
      },
      { once: true }
    );
  });
}

function waitForAgent(uuid = clientUUID) {
  return new Promise((resolve, reject) => {
    socket.send(`wait_for_agent {uuid:"${uuid}"}`);
    socket.addEventListener(
      "message",
      (event) => {
        let response = JSON.parse(event.data);
        console.log(response);
        if (response.result == "success") {
          resolve([
            response.payload.assigned_agent.rainbowID,
            response.payload.assigned_agent.uuid,
          ]);
        } else if (response.result == "pending") {
          document.getElementById("waitingAgent").style.display = "";
          document.getElementById("waitingAgent").innerHTML =
            "All our agents are currently busy. You are placed in a queue and an agent will be assigned to you shortly. <br/> Please wait in this chat for your turn.";

          resolve(
            (() => {
              return new Promise((resolve, reject) => {
                socket.addEventListener(
                  "message",
                  (event) => {
                    let response = JSON.parse(event.data);
                    console.log(response);
                    if (response.result == "success") {
                      resolve([
                        response.payload.assigned_agent.rainbowID,
                        response.payload.assigned_agent.uuid,
                      ]);
                    } else {
                      resolve(waitForAgent());
                    }
                  },
                  { once: true }
                );
              });
            })()
          );
        } else {
          document.getElementById("waitingAgent").style.display = "";
          document.getElementById("waitingAgent").innerHTML =
            "All our agents are currently busy. You are placed in a queue and an agent will be assigned to you shortly. Please wait in this chat for your turn.";
          resolve(waitForAgent());
        }
      },
      { once: true }
    );
  });
}

function loadRainbowSDK() {
  return new Promise((resolve, reject) => {
    rainbowSDK.start();
    rainbowSDK.load();
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, resolve(), {
      once: true,
    });
  });
}

async function initRainbowSDK() {
  let initSDK = rainbowSDK.initialize(APPLICATION_ID, APPLICATION_SECRET);
  let request = new Request("https://localhost:3005/sdk/makeaccount", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      customer_option: customer_option,
      customer_email: customer_email,
    }),
  });
  let getCredentials = fetch(request);
  let resolvedValues = await Promise.all([initSDK, getCredentials]);
  let credentials = await resolvedValues[1].json();
  await rainbowSDK.connection.signin(
    credentials.loginEmail,
    credentials.password
  );
  console.log("logged in");
}

async function initChat(id = agentId) {
  try {
    contact = await getContact(id);
    associatedConversation = await rainbowSDK.conversations.openConversationForContact(
      contact
    );
    initUI();
  } catch (err) {
    console.log(err);
  }
}

function getContact(id) {
  return rainbowSDK.contacts
    .searchById(id)
    .then((contact) => {
      return new Promise((resolve, reject) => {
        if (contact) {
          console.log("Contact found");
          resolve(contact);
        } else {
          reject("Contact not found");
        }
      });
    })
    .catch(function (err) {
      //Something when wrong with the server. Handle the trouble here
      console.log(err);
    });
}

function closeSupportRequest() {
  return new Promise((resolve, reject) => {
    socket.send(`close_support_request {uuid:"${clientUUID}"}`);
    socket.addEventListener(
      "message",
      (event) => {
        let response = JSON.parse(event.data);
        console.log(response);
        if (response.result == "success") {
          resolve();
        } else if (response.result == "pending") {
          resolve(
            (() => {
              return new Promise((resolve, reject) => {
                socket.addEventListener(
                  "message",
                  (event) => {
                    let response = JSON.parse(event.data);
                    console.log(response);
                    if (response.result == "success") {
                      resolve();
                    } else {
                      reject();
                    }
                  },
                  { once: true }
                );
              });
            })()
          );
        } else {
          reject(response.payload);
        }
      },
      { once: true }
    );
  });
}

function changeSupportRequestType(type) {
  return new Promise((resolve, reject) => {
    socket.send(
      `change_support_request_type {uuid:"${clientUUID}", type:${type}}`
    );
    socket.addEventListener(
      "message",
      (event) => {
        let response = JSON.parse(event.data);
        console.log(response);
        if (response.result == "success") {
          resolve();
        } else if (response.result == "pending") {
          resolve(
            (() => {
              return new Promise((resolve, reject) => {
                socket.addEventListener(
                  "message",
                  (event) => {
                    let response = JSON.parse(event.data);
                    console.log(response);
                    if (response.result == "success") {
                      resolve();
                    } else {
                      reject(response.payload);
                    }
                  },
                  { once: true }
                );
              });
            })()
          );
        } else {
          reject(response.payload);
        }
      },
      { once: true }
    );
  });
}

function dropSupportRequest() {
  return new Promise((resolve, reject) => {
    socket.send(`drop_support_request {uuid:"${agentUUID}"}`);
    socket.addEventListener(
      "message",
      (event) => {
        let response = JSON.parse(event.data);
        console.log(response);
        if (response.result == "success") {
          resolve();
        } else if (response.result == "pending") {
          resolve(
            (() => {
              return new Promise((resolve, reject) => {
                socket.addEventListener(
                  "message",
                  (event) => {
                    let response = JSON.parse(event.data);
                    console.log(response);
                    if (response.result == "success") {
                      resolve();
                    } else {
                      reject(response.payload);
                    }
                  },
                  { once: true }
                );
              });
            })()
          );
        } else {
          reject(response.payload);
        }
      },
      { once: true }
    );
  });
}

async function reassignAgent(type) {
  await dropSupportRequest();
  await changeSupportRequestType(type);
  [agentId, agentUUID] = await waitForAgent();
  console.log(agentId);
}

function elementRemoveListeners(el) {
  let new_el = el.cloneNode(true);
  el.parentNode.replaceChild(new_el, el);
}

async function reinitialiseChat(id = agentId) {
  elementRemoveListeners(document.getElementById("dlchatlog"));
  elementRemoveListeners(document.getElementById("voiceChat"));
  elementRemoveListeners(document.getElementById("submitmsg"));
  elementRemoveListeners(document.getElementById("usermsg"));

  // # TODO Disable UI / Loading Indicator?
  try {
    contact = await getContact(id);
    associatedConversation = await rainbowSDK.conversations.openConversationForContact(
      contact
    );
    assignInputListeners();
    rainbowSDK.im.sendMessageToConversation(
      associatedConversation,
      "The session has begun with " + customer_email
    );
  } catch (err) {
    console.log(err);
  }
}

function assignInputListeners() {
  /* VOICE SUPPORT */
  document.getElementById("voiceChat").addEventListener("click", () => {
    //calling
    voiceChat();
  });
  document.getElementById("submitmsg").addEventListener("click", () => {
    let message = document.getElementById("usermsg").value;
    document.getElementById("usermsg").value = "";
    let d = new Date().toLocaleString();
    userDLChatLog.push(
      d + "<===> From: " + firstName + " " + lastName + ": " + message
    );
    rainbowSDK.im.sendMessageToConversation(associatedConversation, message);
    addMessage(firstName + " " + lastName, message, "right");
  });
  document.getElementById("usermsg").addEventListener("keydown", (key) => {
    if (key.keyCode == 13) {
      let message = document.getElementById("usermsg").value;
      document.getElementById("usermsg").value = "";
      let d = new Date().toLocaleString();
      userDLChatLog.push(
        d + "<===> From: " + firstName + " " + lastName + ": " + message
      );
      rainbowSDK.im.sendMessageToConversation(associatedConversation, message);
      addMessage(firstName + " " + lastName, message, "right");
    }
  });
  document.getElementById("dlchatlog").addEventListener("click", () => {
    // download chat log
    console.log(userDLChatLog);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(userDLChatLog)], {
        type: "text/plain",
      })
    );
    a.setAttribute("download", "ChatLog.txt");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

function disableInputFields() {
  document.getElementById("dlchatlog").disabled = true;
  document.getElementById("dlchatlog").style.cursor = "default";
  document.getElementById("voiceChat").disabled = true;
  document.getElementById("voiceChat").style.cursor = "default";
  document.getElementById("submitmsg").disabled = true;
  document.getElementById("submitmsg").style.cursor = "default";
  document.getElementById("usermsg").disabled = true;
  document.getElementById("exit").disabled = true;
  document.getElementById("exit").style.cursor = "default";
}

function initUI(conversation) {
  assignInputListeners();

  // EXIT SEQUENCE
  $(window).bind("beforeunload", async function (e) {
    if (!closeBoolean) {
      endChat();
      try {
        await closeSupportRequest();
      } catch (err) {}
      socket.close();
      return "TO CLOSE";
    } else {
      return null;
    }
  });

  document.addEventListener(
    rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED,
    handleError(async (event) => {
      let message = event.detail.message;
      let conversation = event.detail.conversation;
      //COMMANDS
      if (message.data == "//endchat") {
        //send data to routing engine that chat is closed so that new user can be reassigned to the agent
        let message2 = "The chat session will now be closed.";

        //send data to routing engine that chat is closed so that new user can be reassigned to the agent
        await closeSupportRequest();
        socket.close();
        addMessage(
          contact.firstname + " " + contact.lastname,
          message2,
          "left"
        );
        disableInputFields();
      } else if (message.data.contains("//reassignagent")) {
        let type = message.data[message.data.length - 1];
        if (!Number.isInteger(type)) {
          rainbowSDK.im.sendMessageToConversation(
            associatedConversation,
            "Please send a type. Eg. //reassignagent_1"
          );
          return;
        }
        //send data to routing engine
        await reassignAgent(type);

        let message2 = "We will now be reassigning another agent to you.";
        addMessage(
          contact.firstname + " " + contact.lastname,
          message2,
          "left"
        );
        reinitialiseChat();
      } else {
        console.log(message);
        let d = new Date().toLocaleString();
        userDLChatLog.push(
          d +
            "<===> From: " +
            message.from.firstname +
            " " +
            message.from.lastname +
            ": " +
            message.data
        );
        rainbowSDK.im.markMessageFromConversationAsRead(conversation, message);
        addMessage(
          contact.firstname + " " + contact.lastname,
          message.data,
          "left"
        );
      }
    })
  );
  rainbowSDK.im.sendMessageToConversation(
    associatedConversation,
    "The session has begun with " + customer_email
  );

  document.getElementById("usermsg").disabled = false;
  let submitbtn = document.getElementById("submitmsg");
  submitbtn.removeChild(document.getElementById("loadanimation"));
  submitbtn.innerHTML = "Send";
  submitbtn.disabled = false;

  let voiceChatbtn = document.getElementById("voiceChat");
  voiceChatbtn.removeChild(document.getElementById("loadanimation"));
  voiceChatbtn.innerHTML = "Voice Chat";
  voiceChatbtn.disabled = false;

  let chatDLbtn = document.getElementById("dlchatlog");
  chatDLbtn.removeChild(document.getElementById("loadanimation"));
  chatDLbtn.innerHTML = "Download Chat Log";
  chatDLbtn.disabled = false;

  let exitbtn = document.getElementById("exit");
  exitbtn.disabled = false;
  exitbtn.addEventListener("click", handleError(exitBtnSocket), false);

  document.getElementById("waitingAgent").style.display = "none";

  async function exitBtnSocket() {
    let confirmed = window.confirm("Exit To Main Menu?");
    if (confirmed) {
      closeBoolean = true;
      endChat();
      await closeSupportRequest();
      socket.close();
      window.location.pathname = "/";
    }
  }
}

function endChat() {
  try {
    rainbowSDK.im.sendMessageToConversation(
      associatedConversation,
      "The session has ended with " + customer_email
    );
  } catch (err) {
    console.log(err);
  }
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

function timeOut() {
  let secondsSinceLastActivity = 0;

  // In Seconds
  const maxInactivity = timeoutinSeconds;

  // Prevent double load
  let boolFlag = true;

  setInterval(
    handleError(async function () {
      secondsSinceLastActivity++;
      // After timeout
      if (secondsSinceLastActivity > maxInactivity && boolFlag) {
        boolFlag = false;
        closeBoolean = true;
        endChat();
        window.alert("You have been logged out due to inactivity.");
        await closeSupportRequest();
        socket.close();
        window.location.pathname = "/";
      }
    }),
    1000
  );

  function activity() {
    //reset the secondsSinceLastActivity to 0
    secondsSinceLastActivity = 0;
  }

  const activityEvents = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
  ];

  activityEvents.forEach(function (eventName) {
    document.addEventListener(eventName, activity, true);
  });
}

timeOut();

function voiceChat() {
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
    .then(function (stream) {
      /* Stream received which means that the user has authorized the application to access to the audio and video devices. Local stream can be stopped at this time */
      stream.getTracks().forEach(function (track) {
        track.stop();
      });

      /*  Get the list of available devices */
      navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
          /* Do something for each device (e.g. add it to a selector list) */
          devices.forEach(function (device) {
            if (device.deviceId == "default") {
              console.log(device);
            }
          });
        })
        .catch(function (error) {
          /* In case of error when enumerating the devices */
          console.log("Error enum devices");
        });
    })
    .catch(function (error) {
      /* In case of error when authorizing the application to access the media devices */
      console.log("Error Authorizing Application to access media devices");
    });

  /* Select the microphone to use */
  rainbowSDK.webRTC.useMicrophone("default");
  /* Select the speaker to use */
  rainbowSDK.webRTC.useSpeaker("default");

  /* Call this API to call a contact using only audio stream*/
  let res = rainbowSDK.webRTC.callInAudio(contact);

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
}

const user_stays = async function () {
  endChat();
  try {
    await closeSupportRequest();
  } catch (err) {}
  socket.close();
  window.location.pathname = "/";
};

window.addEventListener("beforeunload", async function onBeforeUnload(e) {
  setTimeout(user_stays, 500);
  endChat();
  try {
    await closeSupportRequest();
  } catch (err) {}
  socket.close();
});
