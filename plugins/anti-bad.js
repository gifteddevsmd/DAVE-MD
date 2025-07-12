const { cmd } = require('../command');
const config = require('../config');

// Anti-Bad Words System
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply,
  sender
}) => {
  try {
    const badWords = [
      "wtf", "mia", "xxx", "fuck", "sex",
      "huththa", "pakaya", "ponnaya", "hutto"
    ];

    if (!isGroup || isAdmins || !isBotAdmins) return;

    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));

    if (containsBadWord && config.ANTI_BAD_WORD === "true") {
      await conn.sendMessage(from, { delete: m.key });
      await conn.sendMessage(from, {
        text: "🚫 ⚠️ *BAD WORD DETECTED!* ⚠️ 🚫\n\nKeep the chat clean, or you'll be removed."
      }, { quoted: m });
    }

  } catch (error) {
    console.error("[AntiBad Error]", error);
    reply("❌ An error occurred while checking for bad words.");
  }
});