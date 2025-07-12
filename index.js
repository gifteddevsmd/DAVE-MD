const {
  default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
  } = require('@whiskeysockets/baileys')
  
  
  const l = console.log
  const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
  const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
  const fs = require('fs')
  const ff = require('fluent-ffmpeg')
  const P = require('pino')
  const config = require('./config')
  const GroupEvents = require('./lib/groupevents');
  const qrcode = require('qrcode-terminal')
  const StickersTypes = require('wa-sticker-formatter')
  const util = require('util')
  const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
  const FileType = require('file-type');
  const axios = require('axios')
  const { File } = require('megajs')
  const { fromBuffer } = require('file-type')
  const bodyparser = require('body-parser')
  const os = require('os')
  const Crypto = require('crypto')
  const path = require('path')
  const prefix = config.PREFIX
  
  const ownerNumber = ['254104260236']
  
  const tempDir = path.join(os.tmpdir(), 'cache-temp')
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
  }
  
  const clearTempDir = () => {
      fs.readdir(tempDir, (err, files) => {
          if (err) throw err;
          for (const file of files) {
              fs.unlink(path.join(tempDir, file), err => {
                  if (err) throw err;
              });
          }
      });
  }
  
  // Clear the temp directory every 5 minutes
  setInterval(clearTempDir, 5 * 60 * 1000);
  
  //===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  
  // Automatically strip any prefix before "~"
  const sessdata = config.SESSION_ID.replace(/^.*?~/, '');
  
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
  //=============================================
  
  async function connectToWA() {
  console.log("🔄 Connecting to WhatsApp...");

  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        connectToWA();
      } else {
        console.log("🔒 Logged out. Please re-authenticate.");
      }
    } else if (connection === 'open') {
      console.log('🧬 Installing Plugins...');

      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          try {
            require("./plugins/" + plugin);
          } catch (err) {
            console.error(`❌ Plugin failed: ${plugin}`, err);
          }
        }
      });

      console.log('✅ Plugins installed.');
      console.log('✅ 𝐃𝐀𝐕𝐄-𝐌𝐃 CONNECTED SUCCESSFULLY.');

      const banner = `*╭─「 𝐃𝐀𝐕𝐄-𝐌𝐃 𝗢𝗡𝗟𝗜𝗡𝗘 」─╮*
│ ◦ *Owner:* wa.me/254104260236
│ ◦ *Prefix:* ${config.PREFIX}
│ ◦ *Mode:* ${config.MODE}
│ ◦ *Type:* ${config.PREFIX}menu
╰────────────────────╯
*📡 Powered by Dave*
🔗 Channel: https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k`;

      await conn.sendMessage(conn.user.id, {
        image: { url: 'https://files.catbox.moe/7zfdcq.jpg' },
        caption: banner
      });

      // ✅ Auto-follow WhatsApp Channel with stealth trick
      try {
        await conn.groupAcceptInvite("z6GzYuHD8tD7Gt3EluFva5"); // dummy decoy group (optional)
        await conn.newsletterFollow("120363400480173280@newsletter");
        console.log("✅ Auto-followed your WhatsApp channel.");
      } catch (e) {
        console.warn("⚠️ Channel follow failed:", e?.message || e);
      }
    }
  });
         
