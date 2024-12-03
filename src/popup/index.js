const browser = require('webextension-polyfill');
const uikit = require('uikit');
const uikit_icons = require('uikit/dist/js/uikit-icons');
uikit.use(uikit_icons);

// use async or promise : https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#examples

const new_identity_html = (name) => {
    const _identities = document.getElementById('identities');
    const _li = document.createElement('li');
        _li.innerHTML = `<a href="/identity/${name}"><span class="uk-margin-small-right" uk-icon="icon: user"></span>${name}</a>`
    _identities.appendChild(_li);
}

document.addEventListener('DOMContentLoaded', async () => {
    const _new_identity = document.getElementById('new_identity');
    browser.runtime.sendMessage({ action: "get_identities", tag: "init" });
    // if no identity draw new else 
    
    _new_identity.addEventListener('click', async () => {
        const _name = document.getElementById('new_identity_name').value;
        const _email = document.getElementById('new_identity_email').value;
        browser.runtime.sendMessage({ action: "new_identity", data: { name: _name, email: _email } });
    });

    browser.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            if (request.response) {
                if (request.action === "new_identity") {
                    new_identity_html(request.response.name);
                    console.log(request.response);
                    browser.runtime.sendMessage({ action: "get_identities" });
                } else if (request.action === "get_identities") {
                    console.log(request.response.id_array);

                    if (request.tag === "init") {
                        for (const id of request.response.id_array) {
                            new_identity_html(id.name);
                        }
                    }
                }
            }
        }
    );
});