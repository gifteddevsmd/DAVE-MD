// Dave
const mime = require('mime-types');

function getMimeFromExtension(ext) {
    return mime.lookup(ext) || 'application/octet-stream';
}

module.exports = { getMimeFromExtension };
