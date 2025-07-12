const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["viewonce", "vv2"],
  react: "📥",
  desc: "Owner Only – Retrieve quoted view-once media to DM",
  category: "owner",
  filename: __filename
}, async (client, message, match, { isOwner }) => {
  try {
    if (!isOwner) return;

    if (!match.quoted || !match.quoted.download) return;

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const caption = match.quoted.text || '';
    const options = { quoted: message };

    let content = {};
    switch (mtype) {
      case "imageMessage":
        content = {
          image: buffer,
          caption,
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        content = {
          video: buffer,
          caption,
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        content = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: !!match.quoted.ptt
        };
        break;
      default:
        return;
    }

    await client.sendMessage(message.sender, content, options);
  } catch (error) {
    console.error("vv error:", error);
  }
});