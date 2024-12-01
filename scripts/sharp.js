const sharp = require('sharp');
const path = require('node:path');
const fs = require('node:fs');

const _icon_sizes = [16, 32, 64, 128, 256, 512];
const _icon_buffer = fs.readFileSync(path.join(__dirname, '../src/icons/icon.png'));
if (!fs.existsSync(path.join(__dirname, '../dist/icons'))) { fs.mkdirSync(path.join(__dirname, '../dist/icons')) }

for (const size of _icon_sizes) {
    sharp(_icon_buffer).resize({ width: size, height: size }).toFormat('png').toFile(path.join(__dirname, `../dist/icons/icon-${size}.png`), (err, info) => { 
        if (err) { console.log(err) }
        //
    });
}
