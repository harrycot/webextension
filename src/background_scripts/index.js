const leftPad = require("left-pad");
const browser = require('webextension-polyfill');

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const result = leftPad(message.text, message.amount, message.with);
    sendResponse(result);
});
