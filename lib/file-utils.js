// Dave
const fs = require('fs');
const path = require('path');

function saveFile(buffer, name, ext = 'bin') {
    const filePath = path.join(__dirname, '..', 'temp', `${name}.${ext}`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

module.exports = { saveFile };
