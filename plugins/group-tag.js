const { cmd } = require('../command');

cmd({
  pattern: "hidetag",
  alias: ["tag", "h"],
  react: "🔊",
  desc: "Tag all group members with text or media.",
  category: "group",
  use: '.hidetag Hello',
  filename: __filename
}, async (conn, mek, m, {
  from, q, isGroup, isOwner, isAdmins, participants, reply
}) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins && !isOwner) return reply("❌ Only group admins can use this command.");

    const mentionAll = { mentions: participants.map(u => u.id) };

    // Handle quoted media or text
    if (m.quoted) {
      const type = Object.keys(m.quoted.message || {})[0];

      // Handle media types
      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        const buffer = await m.quoted.download();
        if (!buffer) return reply("❌ Failed to download quoted media.");

        let content;
        switch (type) {
          case "imageMessage":
            content = { image: buffer, caption: m.quoted.text || "📷 Image", ...mentionAll };
            break;
          case "videoMessage":
            content = {
              video: buffer,
              caption: m.quoted.text || "🎥 Video",
              gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false,
              ...mentionAll
            };
            break;
          case "audioMessage":
            content = {
              audio: buffer,
              mimetype: "audio/mp4",
              ptt: m.quoted.message?.audioMessage?.ptt || false,
              ...mentionAll
            };
            break;
          case "stickerMessage":
            content = { sticker: buffer, ...mentionAll };
            break;
          case "documentMessage":
            content = {
              document: buffer,
              mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
              fileName: m.quoted.message?.documentMessage?.fileName || "file",
              caption: m.quoted.text || "",
              ...mentionAll
            };
            break;
        }

        return await conn.sendMessage(from, content, { quoted: mek });
      }

      // If quoted text only
      return await conn.sendMessage(from, {
        text: m.quoted.text || "📨 Message",
        ...mentionAll
      }, { quoted: mek });
    }

    // If direct message is sent instead of quote
    if (q) {
      return await conn.sendMessage(from, {
        text: q,
        ...mentionAll
      }, { quoted: mek });
    }

    // If nothing provided
    return reply("❌ Please provide a message or reply to media/text to tag all members.");

  } catch (e) {
    console.error("Hidetag Error:", e);
    return reply(`❌ *An error occurred:*\n\n${e.message}`);
  }
});