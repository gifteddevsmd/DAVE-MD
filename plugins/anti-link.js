const { cmd } = require('../command');
const config = require("../config");

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!config || config.ANTI_LINK !== 'true') return;

    if (!isGroup || isAdmins || !isBotAdmins) return;

    if (!global.warnings) global.warnings = {};

    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      /https?:\/\/(?:api\.whatsapp\.com|wa\.me)\/\S+/gi,
      /wa\.me\/\S+/gi,
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?.+\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
      /https?:\/\/(?:whatsapp\.com|channel\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body.toLowerCase()));

    if (containsLink) {
      await conn.sendMessage(from, { delete: m.key });

      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      const warningCount = global.warnings[sender];

      if (warningCount < 4) {
        await conn.sendMessage(from, {
          text:
            `‎*⚠️ LINKS ARE NOT ALLOWED ⚠️*\n\n` +
            `*╭── ⚠️ WARNING ⚠️ ──╮*\n` +
            `├ 👤 *User:* @${sender.split('@')[0]}\n` +
            `├ 📊 *Count:* ${warningCount}/3\n` +
            `├ ❌ *Reason:* Link Detected\n` +
            `╰──────────────────────`,
          mentions: [sender]
        });
      } else {
        await conn.sendMessage(from, {
          text: `🚫 @${sender.split('@')[0]} *has been removed: too many warnings.*`,
          mentions: [sender]
        });
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[sender];
      }
    }

  } catch (err) {
    console.error("Anti-link error:", err);
    reply("❌ An error occurred while processing anti-link.");
  }
});