const { cmd } = require('../command');
const config = require('../config');

// Initialize global memory store
if (!global.antilinkSettings) global.antilinkSettings = {};

const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /https?:\/\/(?:www\.)?(telegram|youtube|facebook|instagram|twitter|tiktok|linkedin|discord|reddit|snapchat|medium|twitch|vimeo|dailymotion)\.com\/\S+/gi
];

// Listen to all messages
cmd({
  on: 'body'
}, async (conn, m, store, {
  from, body, sender, isGroup, isAdmins, isBotAdmins, isOwner, reply
}) => {
  if (!config.ANTI_LINK || config.ANTI_LINK !== "true") return;

  if (!isGroup || isAdmins || !isBotAdmins) return;

  const containsLink = linkPatterns.some(pattern => pattern.test(body));
  const mode = global.antilinkSettings[from]?.mode || 'warn';

  if (containsLink) {
    await conn.sendMessage(from, { delete: m.key }, { quoted: m });

    if (mode === 'kick') {
      await conn.sendMessage(from, {
        text: `⚠️ Links are not allowed.\n@${sender.split('@')[0]} has been removed.`,
        mentions: [sender]
      });
      await conn.groupParticipantsUpdate(from, [sender], "remove");

    } else if (mode === 'warn') {
      global.warnings = global.warnings || {};
      global.warnings[sender] = (global.warnings[sender] || 0) + 1;

      const count = global.warnings[sender];

      if (count >= 3) {
        await conn.sendMessage(from, {
          text: `🚫 @${sender.split('@')[0]} reached *3 warnings* and is removed.`,
          mentions: [sender]
        });
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[sender];
      } else {
        await conn.sendMessage(from, {
          text: `⚠️ *Link detected!*\n@${sender.split('@')[0]} has *${count}/3* warnings.`,
          mentions: [sender]
        });
      }
    }
  }
});

// Admin command to control Anti-Link behavior
cmd({
  pattern: "antilink",
  desc: "Manage Anti-Link mode",
  category: "group",
  filename: __filename
}, async (conn, m, match, {
  from, reply, q, isOwner
}) => {
  if (!isOwner) return reply("*📛 Owner command only.*");

  const mode = q?.toLowerCase();

  if (!global.antilinkSettings[from]) {
    global.antilinkSettings[from] = { mode: 'warn' };
  }

  switch (mode) {
    case 'mode warn':
      global.antilinkSettings[from].mode = 'warn';
      return reply("*✅ Anti-Link mode set to:* `warn`");

    case 'mode kick':
      global.antilinkSettings[from].mode = 'kick';
      return reply("*✅ Anti-Link mode set to:* `kick`");

    case 'status':
      return reply(`*📌 Current Anti-Link Mode:*\n\`\`\`${global.antilinkSettings[from].mode}\`\`\``);

    default:
      return reply(`*🛡 Anti-Link Usage:*\n
• \`.antilink mode warn\` – Warn 3x then kick
• \`.antilink mode kick\` – Kick instantly
• \`.antilink status\` – Show current mode`);
  }
});