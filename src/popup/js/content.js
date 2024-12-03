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

exports.identity = (data) => {
    return `
        ${data}
    `
}