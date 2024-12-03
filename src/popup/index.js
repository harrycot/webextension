const browser = require('webextension-polyfill');
const uikit = require('uikit');
const uikit_icons = require('uikit/dist/js/uikit-icons');
uikit.use(uikit_icons);

// use async or promise : https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#examples

const header_new_identity_html = (name) => {
    const _identities = document.getElementById('identities');
    const _li = document.createElement('li');
        _li.innerHTML = `<a id="identity-${name}" href="#"><span class="uk-margin-small-right" uk-icon="icon: user"></span>${name}</a>`
    _identities.appendChild(_li);
}

document.addEventListener('DOMContentLoaded', async () => {
    browser.runtime.sendMessage({ action: "get_identities", tag: "init" });

    document.getElementById('link_new_identity').addEventListener('click', async () => {
        require('./js/content').draw("new_identity");
    });

    browser.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            if (request.response) {
                if (request.action === "new_identity") {
                    header_new_identity_html(request.response.name);
                    console.log(request.response);
                    browser.runtime.sendMessage({ action: "get_identities" });
                } else if (request.action === "get_identities") {
                    if (request.tag === "init") {
                        for (const id of request.response.id_array) {
                            header_new_identity_html(id.name);
                        }
                        if (request.response.id_array.length > 0) {
                            console.log(request.response.id_array);
                            // get default identity
                            const _data = request.response.id_array;
                            // then
                            require('./js/content').draw("identity", _data);
                            // draw id
                        } else {
                            // draw new
                            require('./js/content').draw("new_identity");
                        }
                    }
                }
            }
        }
    );
});