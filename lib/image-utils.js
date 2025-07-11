// Dave
const sharp = require('sharp');

async function resizeImage(buffer, width = 512, height = 512) {
    return await sharp(buffer).resize(width, height).toBuffer();
}

module.exports = { resizeImage };
