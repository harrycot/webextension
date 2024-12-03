const path = require('node:path');
const fs = require('node:fs');

_path_css = path.join(__dirname, '../dist/popup/bundle.css');
_path_js_body = path.join(__dirname, '../dist/popup/bundle.js');
_path_html = path.join(__dirname, '../dist/popup/index.html');
const _http = require('node:http').createServer( (req, res) => {
    console.log(req.url);
    const _files = [
        { req: '/bundle.css', path: _path_css, type: 'text/css' },
        { req: '/bundle.js', path: _path_js_body, type: 'text/javascript' },
    ];
    for (file of _files) {
        if (req.url == file.req) {
            fs.readFile(file.path, (err, data) => {
                if (err) { console.log(err) }
                res.writeHead(200, {'Content-Type': file.type} ); res.write(data); res.end();
            }); return;
        }
    }
    fs.readFile(_path_html, (err, data) => {
        if (err) { console.log(err) }
        res.writeHead(200, {'Content-Type': 'text/html'} ); res.write(data); res.end();
    });
});

_http.listen({ port: 8000 }, () => {
    console.log(`  server listening on port: 8000\n`);
});