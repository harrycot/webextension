const browser = require('webextension-polyfill');
const openpgp = require('openpgp');

// service_worker: https://codimite.ai/blog/service-workers-in-chrome-extensions-mv3-powering-background-functionality/

browser.runtime.onInstalled.addListener(async () => {
    // have to set a master password for encryption
    await browser.storage.local.set({id: {}});
});
  
browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.action === "new_identity") {
            const _id_keys = await require('./crypto').openpgp.generate(request.data.name, request.data.email);
            const _id = { name: request.data.name, email: request.data.email, keys: _id_keys };
            await browser.storage.local.set({ id: _id });
            browser.runtime.sendMessage({info: "new_identity", id: _id });
        }
    }
);