const axios = require("axios");
const { cmd } = require("../command");

// 📖 Bible verse fetcher
cmd({
  pattern: "bible",
  desc: "Fetch Bible verses by reference",
  category: "fun",
  react: "📖",
  filename: __filename
}, 
async (conn, mek, m, { args, reply }) => {
  try {
    if (!args.length) {
      return reply(`⚠️ *Please provide a Bible reference.*\n\n📝 Example:\n.bible John 3:16`);
    }

    const reference = args.join(" ");
    const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data?.text) {
      const { reference: ref, text, translation_name } = response.data;

      reply(
        `📖 *Reference:* ${ref}\n` +
        `📜 *Verse:* ${text.trim()}\n\n` +
        `📘 *Translation:* ${translation_name}`
      );
    } else {
      reply("❌ Verse not found. Please check the reference and try again.");
    }
  } catch (error) {
    console.error("Bible plugin error:", error.message);
    reply("⚠️ An error occurred while fetching the Bible verse.");
  }
});