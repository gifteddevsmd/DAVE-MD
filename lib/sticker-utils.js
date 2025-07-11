const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Fetch an image from a URL.
 * @param {string} url - Direct image URL.
 * @returns {Promise<Buffer>} - Image buffer.
 */
async function fetchImage(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch image:", error.message);
        throw new Error("Could not fetch image from URL.");
    }
}

/**
 * Fetch a GIF from a URL.
 * @param {string} url - Direct GIF URL.
 * @returns {Promise<Buffer>} - GIF buffer.
 */
async function fetchGif(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch GIF:", error.message);
        throw new Error("Could not fetch GIF from URL.");
    }
}

/**
 * Convert GIF buffer to WhatsApp-compatible WebP sticker.
 * @param {Buffer} gifBuffer - The original GIF data.
 * @returns {Promise<Buffer>} - WebP sticker buffer.
 */
async function gifToSticker(gifBuffer) {
    const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.gif');
    const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');

    fs.writeFileSync(inputPath, gifBuffer);

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .on('error', (err) => reject(new Error("FFmpeg Error: " + err.message)))
            .on('end', resolve)
            .addOutputOptions([
                "-vcodec", "libwebp",
                "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease," +
                       "fps=15,pad=320:320:-1:-1:color=white@0.0," +
                       "split [a][b];[a] palettegen=reserve_transparent=on [p];[b][p] paletteuse",
                "-loop", "0",
                "-preset", "default",
                "-an", "-vsync", "0"
            ])
            .toFormat("webp")
            .save(outputPath);
    });

    const webpBuffer = fs.readFileSync(outputPath);

    // Clean up temporary files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return webpBuffer;
}

module.exports = {
    fetchImage,
    fetchGif,
    gifToSticker
};
