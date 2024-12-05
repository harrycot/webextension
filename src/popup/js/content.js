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
            if (document.getElementById("modal_identity_pgp")) {
                document.getElementById("modal_identity_pgp").remove();
            }
            
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
            // openpgp
            for (const element of document.getElementsByClassName('link_pgp_encrypt_sign_decrypt_verify')) {
                element.addEventListener('click', async () => {
                    uikit.dropdown(document.getElementById("pgp_dropdown")).hide(delay = false);
                    const _name = document.getElementById('identity_name').value;
    
                    // modal fix, form element was removed from uikit (when moved maybe)
                    if (!document.getElementById('modal_identity_pgp_form')) {
                        const _form = document.createElement('form');
                        _form.id = "modal_identity_pgp_form";
                        document.getElementById("modal_identity_pgp_container").appendChild(_form);
                    }
    
                    if (element.classList.contains("link_pgp_encrypt_sign")) {
                        document.getElementById("modal_identity_pgp_form").innerHTML = this.modal_identity_pgp_form_content("link_pgp_encrypt_sign");
                        document.getElementById("sign_btn").addEventListener('click', async (event) => {
                            event.preventDefault();
                            const _textarea_value = document.getElementById('identity_pgp_data_textarea').value;
                            browser.runtime.sendMessage({ action: "identity_sign", data: { name: _name, text: _textarea_value } });
                        });
                        document.getElementById("encrypt_btn").addEventListener('click', async (event) => {
                            event.preventDefault();
                            const _data_textarea_value = document.getElementById('identity_pgp_data_textarea').value;
                            const _pub_textarea_value = document.getElementById('identity_pgp_pub_textarea').value;
                            browser.runtime.sendMessage({ action: "identity_encrypt", data: { name: _name, text: _data_textarea_value, pub: _pub_textarea_value } });
                        });
                        document.getElementById("encrypt_sign_btn").addEventListener('click', async (event) => {
                            event.preventDefault();
                            const _data_textarea_value = document.getElementById('identity_pgp_data_textarea').value;
                            const _pub_textarea_value = document.getElementById('identity_pgp_pub_textarea').value;
                            browser.runtime.sendMessage({ action: "identity_encrypt", data: { name: _name, text: _data_textarea_value, pub: _pub_textarea_value, sign: true } });
                        });
                    } else if (element.classList.contains("link_pgp_decrypt_verify")) {
                        document.getElementById("modal_identity_pgp_form").innerHTML = this.modal_identity_pgp_form_content("link_pgp_decrypt_verify");
                        document.getElementById("verify_btn").addEventListener('click', async (event) => {
                            event.preventDefault();
                            const _textarea_value = document.getElementById('identity_pgp_data_textarea').value;
                            const _pub_textarea_value = document.getElementById('identity_pgp_pub_textarea').value;
                            browser.runtime.sendMessage({ action: "identity_verify", data: { name: _name, text: _textarea_value, pub: _pub_textarea_value } });
                        });
                        document.getElementById("decrypt_btn").addEventListener('click', async (event) => {
                            event.preventDefault();
                            const _data_textarea_value = document.getElementById('identity_pgp_data_textarea').value;
                            browser.runtime.sendMessage({ action: "identity_decrypt", data: { name: _name, text: _data_textarea_value } });
                        });
                        document.getElementById("decrypt_verify_btn").addEventListener('click', async (event) => {
                            event.preventDefault();
                            const _data_textarea_value = document.getElementById('identity_pgp_data_textarea').value;
                            const _pub_textarea_value = document.getElementById('identity_pgp_pub_textarea').value;
                            browser.runtime.sendMessage({ action: "identity_decrypt", data: { name: _name, text: _data_textarea_value, pub: _pub_textarea_value } });
                        });
                    }
                });
            }
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

exports.modal_identity_pgp_form_content = (classname) => {
    return `
        <div class="uk-margin-small-top">
            <textarea id="identity_pgp_data_textarea" class="uk-textarea" rows="4" placeholder="Data"></textarea>
        </div>
        <div class="uk-margin-small-top uk-margin-small-bottom">
            <textarea id="identity_pgp_pub_textarea" class="uk-textarea" rows="4" placeholder="For Verify/Encrypt: Public key or\n['Public key 1', 'Public key 2', ..]"></textarea>
        </div>
        ${classname == "link_pgp_encrypt_sign" ? `
            <button id="sign_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Sign</button>
            <button id="encrypt_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Encrypt</button>
            <button id="encrypt_sign_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Encrypt & Sign</button>
        ` : `
            <button id="verify_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Verify</button>
            <button id="decrypt_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Decrypt</button>
            <button id="decrypt_verify_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Decrypt & Verify</button>
            `
        }
    `
}
exports.modal_identity_pgp_result_content = (data) => {
    return `
        <div class="uk-margin">
            <textarea class="uk-textarea uk-margin-small-top" rows="15" disabled>${data}</textarea>
        </div>
    `
}
exports.identity = (id) => {
    return `
        <form>
            <div>
                ${id.is_default ? `<div class="uk-align-left uk-margin-small-top"><span class="uk-badge">default</span></div>` : ""}
                <div class="uk-align-right">
                    <div class="uk-button-group">
                        <div class="uk-inline">
                            <button class="uk-button uk-button-default" type="button"><span class="uk-margin-small-right" uk-icon="icon: lock"></span>PGP</button>
                            <div id="pgp_dropdown" uk-dropdown="mode: click; target: !.uk-button-group; pos: bottom-right;">
                                <ul class="uk-nav uk-dropdown-nav">
                                    <li><a class="link_pgp_encrypt_sign_decrypt_verify link_pgp_encrypt_sign" href="#modal_identity_pgp" uk-toggle><span class="uk-margin-small-right" uk-icon="icon: lock"></span>Encrypt & Sign</a></li>
                                    <li><a class="link_pgp_encrypt_sign_decrypt_verify link_pgp_decrypt_verify" href="#modal_identity_pgp" uk-toggle><span class="uk-margin-small-right" uk-icon="icon: unlock"></span>Decrypt & Verify</a></li>
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
            ${id.is_default ? "" : `<button id="default_identity_btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Set as default</button>`}
            <button id="delete_identity_btn" class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom">Delete identity</button>
            
            <div id="modal_identity_pgp" class="uk-modal-container" uk-modal>
                <div class="uk-modal-dialog">
                    <div id="modal_identity_pgp_container" class="uk-container uk-container-small">
                        <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>

                        <form id="modal_identity_pgp_form">
                            
                        </form>
                    </div>
                </div>
            </div>
        </form>
    `
}