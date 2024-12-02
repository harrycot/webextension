const path = require('node:path');
const webpack = require('webpack');

const TerserPlugin = require("terser-webpack-plugin");
const WebpackObfuscator = require('webpack-obfuscator');

const _is_production = process.env.NODE_ENV == 'production' ? true : false;

// 
const _obfuscate_web = false;
const _plugins_web = [];

_plugins_web.push(
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    })
);
if (_obfuscate_web) {
    _plugins_web.push(
        new WebpackObfuscator({ // https://github.com/javascript-obfuscator/javascript-obfuscator?tab=readme-ov-file#javascript-obfuscator-options
            rotateStringArray: true,
            target: 'browser-no-eval'
        }, [''])
    );
}


const _terser_options = { // https://github.com/terser/terser/tree/v5.3.8?tab=readme-ov-file#minify-options
    compress: {
        drop_console: true,
        keep_infinity: true
    },
    format: {
        comments: false,
    }
}
module.exports = [
    {
        name: 'web',
        target: 'web',
        mode: process.env.NODE_ENV,
        devtool: _is_production ? false : process.env.DEV == 'yes' ? 'eval-source-map' : false,
        entry: {
            background_scripts: "./src/background_scripts/index.js",
            content_scripts: "./src/content_scripts/index.js",
            popup: process.env.DEV == 'yes' ? "./src/popup/index_dev.js" : "./src/popup/index.js",
            popup_styles: "./src/popup/index.scss",
            popup_html: "./src/popup/index.html",            
            manifest: "./src/manifest.json"
            // everything else not included in zip because no entry specified maybe
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name]/bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    type: "asset/resource",
                    generator: {
                        filename: 'popup/bundle.css',
                    },
                    use: [
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    outputStyle: 'compressed'
                                }
                            }
                        }
                    ],
                },
                {
                    test: /\.json$/,
                    type: "asset/resource",
                    generator: {
                        filename: 'manifest.json',
                    }
                },
                {
                    test: /\.html$/,
                    type: "asset/resource",
                    generator: {
                        filename: 'popup/index.html',
                    }
                }
            ]
        },
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/'),
            },
        },
        optimization: {
            minimize: _is_production ? true : false,
            minimizer: [
                new TerserPlugin({
                    terserOptions: _terser_options,
                    extractComments: false
                })
            ]
        },
        plugins: _plugins_web
    }
];