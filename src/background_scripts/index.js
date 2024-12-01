const browser = require('webextension-polyfill');
const openpgp = require('openpgp');

// service_worker: https://codimite.ai/blog/service-workers-in-chrome-extensions-mv3-powering-background-functionality/

browser.runtime.onInstalled.addListener(async () => {
    const _granted = await browser.permissions.request({ permissions: require('../manifest.json').permissions });
    // have to set a master password for encryption
    if (_granted) {
        browser.storage.sync.set({id: {}}); 
    }
});
  
browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        const _has_permissions = await browser.permissions.contains({ permissions: require('../manifest.json').permissions });
        if (!_has_permissions) {
            const _granted = await browser.permissions.request({ permissions: require('../manifest.json').permissions });
        } else {
            if (request.action === "new_identity") {
                const _id_keys = await require('./crypto').openpgp.generate(request.data.name, request.data.email);
                const _id = { name: request.data.name, email: request.data.email, keys: _id_keys };
                browser.storage.sync.set({ id: _id });
                browser.runtime.sendMessage({info: "new_identity", id: _id });
            }
        }
    }
);