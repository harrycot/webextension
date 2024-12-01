const browser = require('webextension-polyfill');

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "changeColor") {
            document.body.style.backgroundColor = getRandomColor();
            sendResponse({status: "Color changed"});
        }
    }
);

