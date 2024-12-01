const browser = require('webextension-polyfill');

// use async or promise : https://github.com/mozilla/webextension-polyfill?tab=readme-ov-file#examples

document.addEventListener('DOMContentLoaded', async () => {
    var changeColor = document.getElementById('changeColor');
    var countSpan = document.getElementById('count');

    // Load the current count
    const _color_count = await browser.storage.sync.get('colorCount');
    countSpan.textContent = _color_count.colorCount || 0;

    changeColor.addEventListener('click', async () => {
        const _tabs = await browser.tabs.query({active: true, currentWindow: true}); // return array of tabs
        const _response = await browser.tabs.sendMessage(_tabs[0].id, {action: "changeColor"});
        console.log(_response);

        // Increment the count
        const _color_count = await browser.storage.sync.get('colorCount');
        const _new_count = (_color_count.colorCount || 0) + 1;
        browser.storage.sync.set({colorCount: _new_count});
        countSpan.textContent = _new_count;

        // Notify background script
        browser.runtime.sendMessage({action: "colorChanged"});
    });
});