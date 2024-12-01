const browser = require('webextension-polyfill');
const openpgp = require('openpgp');

// service_worker: https://codimite.ai/blog/service-workers-in-chrome-extensions-mv3-powering-background-functionality/

browser.runtime.onInstalled.addListener(async () => {
    // have to set a master password for encryption
    await browser.storage.local.set({ id_array: [] });
});

browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.action === "new_identity") {
            const _id_keys = await require('./crypto').openpgp.generate(request.data.name, request.data.email);
            const _storage_response = await browser.storage.local.get("id_array");
            _storage_response.id_array.push({ name: request.data.name, email: request.data.email, keys: _id_keys });
            await browser.storage.local.set({ id_array: _storage_response.id_array });
            browser.runtime.sendMessage({info: "new_identity", id: {name: request.data.name, email: request.data.email} });
        } else if (request.action === "get_identities") {
            const _storage_response = await browser.storage.local.get("id_array");
            const _identities_view = _storage_response.id_array.map((id) => { return { name: id.name, email: id.email } });
            browser.runtime.sendMessage({ info: "get_identities", data: {id_array: _identities_view} });
        }
    }
);