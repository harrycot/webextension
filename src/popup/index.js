const browser = require('webextension-polyfill');

// use async or promise : https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#examples

document.addEventListener('DOMContentLoaded', async () => {
    const _new_identity = document.getElementById('new_identity');
    _new_identity.addEventListener('click', async () => {
        const _name = document.getElementById('new_identity_name').value;
        const _email = document.getElementById('new_identity_email').value;
        browser.runtime.sendMessage({action: "new_identity", data: { name: _name, email: _email }});
    });

    browser.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            if (request.info === "new_identity") {
                console.log(request.id);
            }
        }
    );
});