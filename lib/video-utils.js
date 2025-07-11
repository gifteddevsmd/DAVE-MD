const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

// Assign ffmpeg binary path
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Convert a video or GIF buffer to WebP (WhatsApp sticker format).
 * @param {Buffer} videoBuffer - The video buffer to convert.
 * @returns {Promise<Buffer>} - Resulting WebP sticker buffer.
 */
async function videoToWebp(videoBuffer) {
  const inputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.mp4');
  const outputPath = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.webp');

  // Save video to disk
  fs.writeFileSync(inputPath, videoBuffer);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .on('error', (err) => reject(new Error(`FFmpeg Error: ${err.message}`)))
        .on('end', resolve)
        .addOutputOptions([
          '-vcodec', 'libwebp',
          '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease," +
                 "fps=15,pad=320:320:-1:-1:color=white@0.0," +
                 "split [a][b];[a] palettegen=reserve_transparent=on [p];[b][p] paletteuse",
          '-loop', '0',
          '-ss', '00:00:00',
          '-t', '00:00:05',
          '-preset', 'default',
          '-an',
          '-vsync', '0'
        ])
        .toFormat('webp')
        .save(outputPath);
    });

    const webpBuffer = fs.readFileSync(outputPath);
    return webpBuffer;

  } finally {
    // Clean temp files
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
}

module.exports = {
  videoToWebp
};
