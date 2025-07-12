const { cmd } = require('../command');

cmd({
  pattern: "save",
  alias: ["sv", "🙂"],
  react: "❤️",
  desc: "Owner Only - Saves a quoted media (photo, video, audio, view-once) and sends it to your DM",
  category: "tools",
  filename: __filename
}, async (conn, msg, m, { from, isOwner }) => {
  try {
    if (!isOwner) {
      return await conn.sendMessage(from, {
        text: "*📛 This is an owner-only command.*"
      }, { quoted: msg });
    }

    if (!m.quoted) {
      return await conn.sendMessage(from, {
        text: "👀 Please reply to a media message (image, video, audio, or view-once)."
      }, { quoted: msg });
    }

    let media;
    try {
      media = await m.quoted.download();
    } catch (err) {
      console.error("Download failed:", err);
      return await conn.sendMessage(from, {
        text: `❌ Error downloading the media:\n${err}`
      }, { quoted: msg });
    }

    const mtype = m.quoted.mtype;
    const mime = m.quoted.mimetype || "";
    const quoted = { quoted: msg };
    let options = {};

    switch (mtype) {
      case "imageMessage":
        options = {
          image: media,
          caption: "> Saved by 𝐃𝐀𝐕𝐄-𝐌𝐃 🖤",
          mimetype: mime || "image/jpeg"
        };
        break;

      case "videoMessage":
        options = {
          video: media,
          caption: "> Saved by 𝐃𝐀𝐕𝐄-𝐌𝐃 🖤",
          mimetype: mime || "video/mp4"
        };
        break;

      case "audioMessage":
        options = {
          audio: media,
          mimetype: "audio/mp4",
          ptt: m.quoted.ptt || false
        };
        break;

      case "viewOnceMessage":
        const viewOnceType = m.quoted?.message?.imageMessage
          ? "image"
          : m.quoted?.message?.videoMessage
          ? "video"
          : null;

        if (!viewOnceType) {
          return await conn.sendMessage(from, {
            text: "❌ Unsupported view-once media type for saving."
          }, { quoted: msg });
        }

        options = {
          [viewOnceType]: media,
          caption: "> Saved view-once by 𝐃𝐀𝐕𝐄-𝐌𝐃 🖤",
          mimetype: viewOnceType === "image" ? "image/jpeg" : "video/mp4",
          viewOnce: true
        };
        break;

      default:
        return await conn.sendMessage(from, {
          text: "❌ Unsupported media type for saving."
        }, { quoted: msg });
    }

    // Send saved media to owner's DM
    await conn.sendMessage(msg.sender, options, quoted);
  } catch (e) {
    console.error("Save command error:", e);
    await conn.sendMessage(from, {
      text: `❌ An error occurred while saving the media:\n${e.message}`
    }, { quoted: msg });
  }
});