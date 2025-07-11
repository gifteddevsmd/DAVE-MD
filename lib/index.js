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

// Optional: Commented out modules for future use
// const { AntiViewOnce } = require('./antivv');
// const { shannzCdn } = require('./shannzCdn');

module.exports = {
  DeletedText,
  DeletedMedia,
  AntiDelete,
  // AntiViewOnce,
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
  DATABASE,
  sms,
  downloadMediaMessage,
  // Dave
};
