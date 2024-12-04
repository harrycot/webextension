const browser = require('webextension-polyfill');
const openpgp = require('openpgp');

// service_worker: https://codimite.ai/blog/service-workers-in-chrome-extensions-mv3-powering-background-functionality/

browser.runtime.onInstalled.addListener(async () => {
    await browser.storage.local.set({ id_array: [] });
});

const get_identities = async (request) => {
    const _storage_response = await browser.storage.local.get("id_array");
    const _identities_view = _storage_response.id_array.map((id) => { return { name: id.name, email: id.email, is_default: id.is_default } });
    browser.runtime.sendMessage(Object.assign(request, {response: {id_array: _identities_view} }));
}
browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.action === "new_identity") {
            const _id_keys = await require('./crypto').openpgp.generate(request.data.name, request.data.email);
            const _storage_response = await browser.storage.local.get("id_array");
            const _is_default = _storage_response.id_array.length == 0;
            _storage_response.id_array.push({ name: request.data.name, email: request.data.email, keys: _id_keys, is_default: _is_default });
            await browser.storage.local.set({ id_array: _storage_response.id_array });
            browser.runtime.sendMessage(Object.assign(request, {response: {name: request.data.name, email: request.data.email, is_default: _is_default} }));
        } else if (request.action === "get_identities") {
            get_identities(request);
        } else if (request.action === "set_default_identity") {
            const _storage_response = await browser.storage.local.get("id_array");
            for (let index = 0; index < _storage_response.id_array.length; index++) {
                if (request.data.name === _storage_response.id_array[index].name) {
                    _storage_response.id_array[index].is_default = true;
                } else {
                    _storage_response.id_array[index].is_default = false;
                }
            }
            await browser.storage.local.set({ id_array: _storage_response.id_array });
            get_identities({ action: "get_identities", tag: "init" });
        } else if (request.action === "delete_identity") {
            const _storage_response = await browser.storage.local.get("id_array");
            for (let index = 0; index < _storage_response.id_array.length; index++) {
                if (request.data.name === _storage_response.id_array[index].name) {
                    _storage_response.id_array.splice(index, 1);
                    index--;
                }
            }
            if ((_storage_response.id_array.filter((el) => { return el.is_default }).length == 0) && (_storage_response.id_array.length >= 1)) {
                _storage_response.id_array[0].is_default = true;
            };
            await browser.storage.local.set({ id_array: _storage_response.id_array });
            get_identities({ action: "get_identities", tag: "init" });
        } else if (request.action === "identity_sign") {
            const _storage_response = await browser.storage.local.get("id_array");
            for (let index = 0; index < _storage_response.id_array.length; index++) {
                if (request.data.name === _storage_response.id_array[index].name) {
                    // openpgp.sign
                    const _date = new Date(Date.now() - 1000);
                    const _openpgp_local_priv_obj = await openpgp.readKey({ armoredKey: Buffer.from(_storage_response.id_array[index].keys.priv, 'base64').toString() });
                    request.data.text = request.data.text.replace("__pub64__", _storage_response.id_array[index].keys.pub);
                    request.data.text = request.data.text.replace("__pub__", Buffer.from(_storage_response.id_array[index].keys.pub, 'base64').toString());
                    const _message = { text: request.data.text };
                    const _unsigned = await openpgp.createCleartextMessage(_message);
                    const _signed = await openpgp.sign({ date: _date, message: _unsigned, signingKeys: _openpgp_local_priv_obj });
                    // openpgp.sign //
                    browser.runtime.sendMessage(Object.assign(request, {response: {text: _signed} }));
                }
            }
        }
    }
);


