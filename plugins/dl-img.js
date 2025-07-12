const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "img",
  alias: ["image", "googleimage", "searchimg"],
  react: "🦋",
  desc: "Search and download Google images",
  category: "fun",
  use: ".img <keywords>",
  filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
  try {
    const query = args.join(" ");
    if (!query) {
      return reply("🖼️ *Please provide a search term.*\n\nExample: `.img cute kittens`");
    }

    await reply(`🔍 *Searching images for:* "${query}"...`);

    const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    if (!response.data?.success || !response.data.results?.length) {
      return reply("❌ No images found. Try different keywords.");
    }

    const images = response.data.results
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    for (const img of images) {
      await conn.sendMessage(from, {
        image: { url: img },
        caption: `📷 *Result for:* ${query}\n\n> 𝐃𝐀𝐕𝐄-𝐌𝐃 🔍 Image Fetcher`
      }, { quoted: mek });

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error("Image Search Error:", error.message);
    reply(`❌ *Error fetching image:* ${error.message}`);
  }
});