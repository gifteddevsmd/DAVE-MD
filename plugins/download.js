// download.js - Updated & Branded for 𝐃𝐀𝐕𝐄-𝐌𝐃

const { fetchJson } = require("../lib/functions"); const { downloadTiktok } = require("@mrnima/tiktok-downloader"); const { facebook } = require("@mrnima/facebook-downloader"); const cheerio = require("cheerio"); const { igdl } = require("ruhend-scraper"); const axios = require("axios"); const { cmd, commands } = require('../command');

// Instagram Downloader cmd({ pattern: "ig", alias: ["insta", "Instagram"], desc: "To download Instagram videos.", react: "🎥", category: "download", filename: __filename }, async (conn, m, store, { from, q, reply }) => { try { if (!q || !q.startsWith("http")) return reply("❌ Please provide a valid Instagram link.");

await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
const data = response.data;

if (!data || data.status !== 200 || !data.downloadUrl) return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");

await conn.sendMessage(from, {
  video: { url: data.downloadUrl },
  mimetype: "video/mp4",
  caption: "📥 *Instagram Video Downloaded by 𝐃𝐀𝐕𝐄-𝐌𝐃!*"
}, { quoted: m });

} catch (err) { console.error(err); reply("❌ Error while processing your request."); } });

// Twitter Downloader cmd({ pattern: "twitter", alias: ["tweet", "twdl"], desc: "Download Twitter videos", category: "download", filename: __filename }, async (conn, m, store, { from, quoted, q, reply }) => { try { if (!q || !q.startsWith("https://")) return reply("❌ Please provide a valid Twitter URL.");

await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
const data = response.data;

if (!data?.status || !data.result) return reply("⚠️ Failed to retrieve Twitter video.");

const { desc, thumb, video_sd, video_hd } = data.result;
const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n┃▸ *Description:* ${desc || "No description"}\n╰━━━━━━━━━━━━━╾╯\n📥 𝐃𝐀𝐕𝐄-𝐌𝐃 supports:\n1️⃣ SD Video\n2️⃣ HD Video\n3️⃣ Audio\n4️⃣ Audio as Document\n5️⃣ Audio as Voice\n\n📌 *Reply with the number to download.*`;

const sentMsg = await conn.sendMessage(from, { image: { url: thumb }, caption }, { quoted: m });
const messageID = sentMsg.key.id;

conn.ev.on("messages.upsert", async (msgData) => {
  const received = msgData.messages?.[0];
  if (!received?.message) return;

  const receivedText = received.message.conversation || received.message.extendedTextMessage?.text;
  const senderID = received.key.remoteJid;
  const isReply = received.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

  if (isReply) {
    await conn.sendMessage(senderID, { react: { text: '⬇️', key: received.key } });
    const send = (msg) => conn.sendMessage(senderID, msg, { quoted: received });

    switch (receivedText) {
      case "1": return send({ video: { url: video_sd }, caption: "📥 Downloaded in SD by 𝐃𝐀𝐕𝐄-𝐌𝐃" });
      case "2": return send({ video: { url: video_hd }, caption: "📥 Downloaded in HD by 𝐃𝐀𝐕𝐄-𝐌𝐃" });
      case "3": return send({ audio: { url: video_sd }, mimetype: "audio/mpeg" });
      case "4": return send({ document: { url: video_sd }, mimetype: "audio/mpeg", fileName: "Twitter_Audio.mp3" });
      case "5": return send({ audio: { url: video_sd }, mimetype: "audio/mp4", ptt: true });
      default: reply("❌ Invalid option! Use 1 - 5.");
    }
  }
});

} catch (err) { console.error(err); reply("❌ Failed to download from Twitter."); } });

// MediaFire Downloader cmd({ pattern: "mediafire", alias: ["mfire"], desc: "To download MediaFire files.", react: "🎥", category: "download", filename: __filename }, async (conn, m, store, { from, q, reply }) => { try { if (!q) return reply("❌ Please provide a MediaFire link.");

await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
const data = response.data;

if (!data?.status || !data.result?.dl_link) return reply("⚠️ Failed to retrieve MediaFire file.");

const { dl_link, fileName, fileType } = data.result;
const caption = `╭━━〔 𝐃𝐀𝐕𝐄-𝐌𝐃 MediaFire 〕━━⊷\n┃ 📄 *Name:* ${fileName}\n┃ 🧩 *Type:* ${fileType}\n╰━━━━━━━━━━━━━━━━━╯\n📥 *File is being sent...*`;

await conn.sendMessage(from, {
  document: { url: dl_link },
  mimetype: fileType || "application/octet-stream",
  fileName: fileName,
  caption
}, { quoted: m });

} catch (err) { console.error(err); reply("❌ MediaFire download error."); } });

// Google Drive Downloader cmd({ pattern: "gdrive", desc: "Download Google Drive files.", react: "🌐", category: "download", filename: __filename }, async (conn, m, store, { from, q, reply }) => { try { if (!q) return reply("❌ Provide a valid Google Drive link.");

await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
const res = await axios.get(apiUrl);
const result = res.data.result;

if (!result?.downloadUrl) return reply("⚠️ Invalid or private Google Drive link.");

await conn.sendMessage(from, {
  document: { url: result.downloadUrl },
  mimetype: result.mimetype,
  fileName: result.fileName,
  caption: "📁 *Google Drive File from 𝐃𝐀𝐕𝐄-𝐌𝐃*"
}, { quoted: m });

} catch (err) { console.error(err); reply("❌ Failed to fetch GDrive file."); } });

