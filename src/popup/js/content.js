const browser = require('webextension-polyfill');
const uikit = require('uikit');

exports.draw = (page, data) => {
    switch (page) {
        case "new_identity":
            document.getElementById("content").innerHTML = this.new_identity();
            document.getElementById('new_identity_btn').addEventListener('click', async () => {
                const _name = document.getElementById('new_identity_name').value;
                const _email = document.getElementById('new_identity_email').value;
                browser.runtime.sendMessage({ action: "new_identity", data: { name: _name, email: _email } });
            });
            break;
        case "identity":
            document.getElementById("content").innerHTML = this.identity(data);
            const _default_identity_btn = document.getElementById('default_identity_btn');
            if (_default_identity_btn) {
                _default_identity_btn.addEventListener('click', async () => {
                    const _name = document.getElementById('identity_name').value;
                    browser.runtime.sendMessage({ action: "set_default_identity", data: { name: _name } });
                });
            }
            document.getElementById('delete_identity_btn').addEventListener('click', async () => {
                const _name = document.getElementById('identity_name').value;
                browser.runtime.sendMessage({ action: "delete_identity", data: { name: _name } });
            });
            document.getElementById('link_pgp_sign').addEventListener('click', async () => {
                uikit.dropdown(document.getElementById("pgp_dropdown")).hide(delay = false);
                const _name = document.getElementById('identity_name').value;
                //
                //draw modal or new page
                //browser.runtime.sendMessage({ action: "pgp_sign", data: { name: _name } });
            });
            
            break;
        default:
            break;
    }
}

exports.new_identity = () => {
    return `
        <form>
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                    <input id="new_identity_name" class="uk-input" type="text" placeholder="Name">
                </div>
            </div>
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: mail"></span>
                    <input id="new_identity_email" class="uk-input" type="text" placeholder="Email">
                </div>
            </div>
            <button id="new_identity_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">New identity</button>
        </form>
    `
}

exports.identity = (id) => {
    return `
        <form>
            
            <div>
                ${id.is_default ? "<div class=\"uk-align-left uk-margin-small-top\"><span class=\"uk-badge\">default</span></div>" : ""}
                <div class="uk-align-right">
                    <div class="uk-button-group">
                        <div class="uk-inline">
                            <button class="uk-button uk-button-default" type="button"><span class="uk-margin-small-right" uk-icon="icon: lock"></span>PGP</button>
                            <div id="pgp_dropdown" uk-dropdown="mode: click; target: !.uk-button-group; pos: bottom-right;">
                                <ul class="uk-nav uk-dropdown-nav">
                                    <li><a id="link_pgp_sign" href="#"><span class="uk-margin-small-right" uk-icon="icon: pencil"></span>Sign</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                    <input id="identity_name" class="uk-input" type="text" placeholder="${id.name}" value="${id.name}" disabled>
                </div>
            </div>
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: mail"></span>
                    <input id="identity_email" class="uk-input" type="text" placeholder="${id.email}" value="${id.email}" disabled>
                </div>
            </div>
            ${id.is_default ? "" : "<button id=\"default_identity_btn\" class=\"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom\">Set as default</button>"}
            <button id="delete_identity_btn" class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom">Delete identity</button>
        </form>
    `
}