const path = require("path");

module.exports = [
    {
        entry: {
            background_scripts: "./background_scripts/background.js",
            popup: "./popup/left-pad.js",
            // everything else not included in zip because no entry specified maybe
        },
        output: {
            path: path.resolve(__dirname, "addon"),
            filename: "[name]/index.js"
        },
        mode: 'none'
    }
];
