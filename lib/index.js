// Anti-delete features
const { DeletedText, DeletedMedia, AntiDelete } = require('./antidel');

// Database connection (Sequelize-based)
const { DATABASE } = require('./database');

// Utility functions
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require('./functions');

// Message tools (SMS/Media)
const { sms, downloadMediaMessage } = require('./msg');

// Media and Sticker Utilities
const { fetchImage, fetchGif, gifToSticker } = require('./sticker-utils');
const { videoToWebp } = require('./video-utils');
const { convertToMp3 } = require('./audio-utils');
const { resizeImage } = require('./image-utils');
const { saveFile } = require('./file-utils');
const { getMimeFromExtension } = require('./media-utils');

// Text and URL Utilities
const { truncate, capitalize } = require('./text-utils');
const { isValidUrl, extractHostname } = require('./url-utils');

// Optional: Commented out modules for future use
// const { AntiViewOnce } = require('./antivv');
// const { shannzCdn } = require('./shannzCdn');

module.exports = {
  // Core Modules
  DeletedText,
  DeletedMedia,
  AntiDelete,
  DATABASE,

  // Utility Functions
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,

  // Message Handling
  sms,
  downloadMediaMessage,

  // Extended Media Utils
  fetchImage,
  fetchGif,
  gifToSticker,
  videoToWebp,
  convertToMp3,
  resizeImage,
  saveFile,
  getMimeFromExtension,

  // Text & URL Utils
  truncate,
  capitalize,
  isValidUrl,
  extractHostname,

  // Future placeholders
  // AntiViewOnce,
  // shannzCdn
};
