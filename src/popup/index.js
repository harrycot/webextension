const browser = require('webextension-polyfill');
const uikit = require('uikit');
const uikit_icons = require('uikit/dist/js/uikit-icons');
uikit.use(uikit_icons);

// use async or promise : https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#examples

const header_new_identity_html = (id) => {
    const _identities = document.getElementById('identities');
    const _default_badge = id.is_default ? "<span class=\"uk-badge uk-margin-small-left\">d</span>" : "";
    const _li = document.createElement('li');
        _li.classList.add("identity");
        _li.innerHTML = `<a id="identity-${id.name}" href="#"><span class="uk-margin-small-right" uk-icon="icon: user"></span>${id.name}${_default_badge}</a>`
    _li.addEventListener('click', async () => {
        uikit.dropdown(document.getElementById("identities_dropdown")).hide(delay = false);
        require('./js/content').draw("identity", id);
    });
    _identities.appendChild(_li);
}

document.addEventListener('DOMContentLoaded', async () => {
    browser.runtime.sendMessage({ action: "get_identities", tag: "init" });

    document.getElementById('link_new_identity').addEventListener('click', async () => {
        uikit.dropdown(document.getElementById("identities_dropdown")).hide(delay = false);
        require('./js/content').draw("new_identity");
    });

    browser.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            console.log(request);
            if (request.response) {
                if (request.action === "new_identity") {
                    header_new_identity_html(request.response);
                    require('./js/content').draw("identity", request.response);
                } else if (request.action === "get_identities") {
                    if (request.tag === "init") {
                        const _li_identities = document.querySelectorAll("#identities li.identity");
                        for (const li of _li_identities) {
                            li.remove();
                        }
                        for (const id of request.response.id_array) {
                            header_new_identity_html(id);
                            if (id.is_default) {
                                require('./js/content').draw("identity", id);
                            }
                        }
                        if (request.response.id_array.length == 0) {
                            require('./js/content').draw("new_identity");
                        }
                    }
                }
            }
        }
    );
});