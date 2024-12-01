const browser = require('webextension-polyfill');

browser.runtime.onInstalled.addListener(function() {
    browser.storage.sync.set({colorCount: 0});
});
  
browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "colorChanged") {
            console.log("Background color was changed");
        }
    }
);