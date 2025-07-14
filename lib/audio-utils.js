// Dave 
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

async function convertToMp3(audioBuffer) {
  const input = path.join(tmpdir(), `${Date.now()}.ogg`); // ✅ fixed backticks
  const output = input.replace('.ogg', '.mp3');

  fs.writeFileSync(input, audioBuffer);

  await new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  const result = fs.readFileSync(output);

  fs.unlinkSync(input);
  fs.unlinkSync(output);

  return result;
}

module.exports = { convertToMp3 };
