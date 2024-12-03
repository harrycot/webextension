const browser = require('webextension-polyfill');
const openpgp = require('openpgp');

// service_worker: https://codimite.ai/blog/service-workers-in-chrome-extensions-mv3-powering-background-functionality/

browser.runtime.onInstalled.addListener(async () => {
    await browser.storage.local.set({ id_array: [] });
});

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
            const _storage_response = await browser.storage.local.get("id_array");
            const _identities_view = _storage_response.id_array.map((id) => { return { name: id.name, email: id.email, is_default: id.is_default } });
            browser.runtime.sendMessage(Object.assign(request, {response: {id_array: _identities_view} }));
        }
    }
);