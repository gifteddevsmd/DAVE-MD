const { cmd } = require("../command");

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  desc: "Owner Only – Retrieve view-once media from a quoted message",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) return; // Silent fail for non-owner

    if (!match.quoted || !match.quoted.download) {
      return await client.sendMessage(from, {
        text: "🍁 *Reply to a view-once media message!*"
      }, { quoted: message });
    }

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
        return await client.sendMessage(from, {
          text: "❌ *Only image, video, or audio messages are supported.*"
        }, options);
    }

    // Forward content back to the user who issued the command
    await client.sendMessage(message.sender, content, options);

  } catch (err) {
    console.error("VV Error:", err);
    await client.sendMessage(from, {
      text: "❌ *An error occurred while retrieving the message:*\n" + err.message
    }, { quoted: message });
  }
});