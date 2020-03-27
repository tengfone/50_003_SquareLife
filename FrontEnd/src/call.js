// function callInAudio(contact) {
//     /* Call this API to call a contact using only audio stream*/
//     var res = rainbowSDK.webRTC.callInAudio(contact);
//     if (res.label === "OK") {
//         console.log("Dailing To Agent");
//     }
// };
//
// async function callinit() {
//     if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
//         /* Your browser is compliant: You can make audio and video call using WebRTC in your application */
//         console.log("Browser supported");
//     } else {
//         /* Your browser is not compliant: Do not propose audio and video call in your application */
//         console.log("Browser not supported");
//     }
//
//     /* Call this method to know if a microphone is detected */
//     if(rainbowSDK.webRTC.hasAMicrophone()) {
//         /* A microphone is available, you can make at least audio call */
//         console.log("Has Microphone")
//     }
//     else {
//         /* No microphone detected */
//         console.log("No Microphone");
//     }
//     /* Ask the user to authorize the application to access to the media devices */
//     navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
//         /* Stream received which means that the user has authorized the application to access to the audio and video devices. Local stream can be stopped at this time */
//         stream.getTracks().forEach(track => {
//             track.stop();
//         });
//
//         /*  Get the list of available devices */
//         navigator.mediaDevices.enumerateDevices().then(devices => {
//
//             /* Do something for each device (e.g. add it to a selector list) */
//             devices.forEach(device => {
//                 if (device.deviceId == "default") {
//                     console.log(device);
//                 }
//             });
//         });
//
//         /* Select the microphone to use */
//         rainbowSDK.webRTC.useMicrophone("default");
//         /* Select the speaker to use */
//         rainbowSDK.webRTC.useSpeaker("default");
//     });
// }
//
// module.exports = callInAudio;
// module.exports = callinit();