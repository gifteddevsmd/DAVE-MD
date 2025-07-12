const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "couplepp",
  alias: ["couple", "cpp"],
  react: '💑',
  desc: "Get a male and female couple profile picture.",
  category: "image",
  use: ".couplepp",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  try {
    reply("💑 *Fetching cute couple profile pictures...*");

    const res = await axios.get("https://api.davidcyriltech.my.id/couplepp");
    if (!res?.data?.success || !res.data.male || !res.data.female) {
      return reply("❌ Couldn't fetch couple DPs. Try again later.");
    }

    await conn.sendMessage(from, {
      image: { url: res.data.male },
      caption: "👦 *Male Couple DP*",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

    await conn.sendMessage(from, {
      image: { url: res.data.female },
      caption: "👧 *Female Couple DP*",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

  } catch (err) {
    console.error("Error fetching couple DP:", err.message);
    reply("❌ An error occurred while retrieving the couple profile pictures.");
  }
});