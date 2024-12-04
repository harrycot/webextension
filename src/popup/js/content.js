const browser = require('webextension-polyfill');

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
                    <input id="new_identity_name" class="uk-input" type="text" aria-label="Not clickable icon" placeholder="Name">
                </div>
            </div>
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: mail"></span>
                    <input id="new_identity_email" class="uk-input" type="text" aria-label="Not clickable icon" placeholder="Email">
                </div>
            </div>
            <button id="new_identity_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">New identity</button>
        </form>
    `
}

exports.identity = (id) => {
    return `
        <form>
            ${id.is_default ? "<span class=\"uk-badge\">default</span>" : ""}
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                    <input id="identity_name" class="uk-input" type="text" aria-label="Not clickable icon" placeholder="${id.name}" value="${id.name}" disabled>
                </div>
            </div>
            <div class="uk-margin">
                <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: mail"></span>
                    <input id="identity_email" class="uk-input" type="text" aria-label="Not clickable icon" placeholder="${id.email}" value="${id.email}" disabled>
                </div>
            </div>
            ${id.is_default ? "" : "<button id=\"default_identity_btn\" class=\"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom\">Set as default</button>"}
            <button id="delete_identity_btn" class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom">Delete identity</button>
        </form>
    `
}