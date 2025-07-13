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
  generateMessageID,
  makeInMemoryStore,
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
const config = require('./settings')
const GroupEvents = require('./lib/groupevents')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type')
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
    if (err) throw err
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err
      })
    }
  })
}

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000)

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
  const sessdata = config.SESSION_ID.replace("Gifted~", '')
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
  filer.download((err, data) => {
    if (err) throw err
    fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
      console.log("[ 📥 ] Session downloaded ✅")
    })
  })
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

let conn // ✅ GLOBAL conn declaration

//=============================================

async function connectToWA() {
  try {
    console.log("[ ♻ ] Connecting to WhatsApp ⏳️...")

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    const { version } = await fetchLatestBaileysVersion()

    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        if (shouldReconnect) {
          await connectToWA()
        }
      } else if (connection === 'open') {
        try {
          console.log('[ 🧬 ] Installing Plugins')

          fs.readdirSync("./plugins/").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() === ".js") {
              require("./plugins/" + plugin)
            }
          })

          console.log('[ ✔ ] Plugins installed successfully ✅')
          console.log('[ 🪀 ] Bot connected to WhatsApp 📲')

          let up = `*Hᴇʟʟᴏ ᴛʜᴇʀᴇ 𝐃𝐀𝐕𝐄-𝐌𝐃 ᴄᴏɴɴᴇᴄᴛᴇᴅ! 👋🏻* 

*ᴋᴇᴇᴘ ᴏɴ ᴜsɪɴɢ 𝐃𝐀𝐕𝐄-𝐌𝐃🚩* 

> sᴜʙsᴄʀɪʙᴇ ʏᴛ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴛᴜᴛᴏʀɪᴀʟs
https://youtube.com/@davlodavlo19

- *ʏᴏᴜʀ ʙᴏᴛ ᴘʀᴇғɪx: ➡️[ . ]*
> - ʏᴏᴜ ᴄᴀɴ ᴄʜᴀɴɢᴇ ᴜʀ ᴘʀᴇғɪx ᴜsɪɴɢ ᴛʜᴇ .ᴘʀᴇғɪx ᴄᴏᴍᴍᴀɴᴅ

> ᴅᴏɴᴛ ғᴏʀɢᴇᴛ ᴛᴏ sʜᴀʀᴇ, sᴛᴀʀ & ғᴏʀᴋ ᴛʜᴇ ʀᴇᴘᴏ ⬇️ 
https://github.com/giftedsession/DAVE-MD

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐃𝐀𝐕𝐄 🇿🇼`;
    conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/7zfdcq.jpg` }, caption: up })

          const channelJid = "120363400480173280@newsletter"
          try {
            await conn.newsletterFollow(channelJid)
            console.log(`Successfully followed channel: ${channelJid}`)
          } catch (error) {
            console.error(`Failed to follow channel: ${error}`)
          }

        } catch (error) {
          console.error("[ ❌ ] Error during post-connect setup:", error)
        }
      }
    })

    conn.ev.on('creds.update', saveCreds)

  } catch (err) {
    console.error("[ ❌ ] Connection failed:", err)
}
	  
