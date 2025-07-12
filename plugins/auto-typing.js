const config = require('../config');
const { cmd } = require('../command');

// Prefixes accepted
const allowedPrefixes = ['.', '#', 'z', 'm', '']; // add more if needed

if (!global.typingConfig) global.typingConfig = {
  group: true,
  private: true
};

// Typing presence trigger
cmd({
  on: "body"
}, async (conn, mek, m, {
  from, isGroup
}) => {
  if (config.AUTO_TYPING !== 'true') return;

  const allow = isGroup ? global.typingConfig.group : global.typingConfig.private;
  if (allow) {
    await conn.sendPresenceUpdate('composing', from);
  }
});

// Prefix-aware command to control typing
cmd({
  pattern: "autotyping",
  desc: "Toggle auto typing in group or DM",
  category: "settings",
  filename: __filename
}, async (conn, m, match, {
  from, reply, q, isOwner, body
}) => {
  // Check for prefix
  const hasValidPrefix = allowedPrefixes.some(p => body.startsWith(p + "autotyping"));
  if (!hasValidPrefix) return;

  if (!isOwner) return reply("🔒 *Owner-only command.*");

  const command = q?.toLowerCase();

  switch (command) {
    case 'on group':
      global.typingConfig.group = true;
      return reply("✅ *Typing enabled in groups.*");

    case 'off group':
      global.typingConfig.group = false;
      return reply("🚫 *Typing disabled in groups.*");

    case 'on dm':
    case 'on private':
      global.typingConfig.private = true;
      return reply("✅ *Typing enabled in private chats.*");

    case 'off dm':
    case 'off private':
      global.typingConfig.private = false;
      return reply("🚫 *Typing disabled in private chats.*");

    case 'status':
      return reply(`*📊 Auto Typing Status:*\n• Group: ${global.typingConfig.group ? 'ON' : 'OFF'}\n• DM: ${global.typingConfig.private ? 'ON' : 'OFF'}`);

    default:
      return reply(`*📘 Usage:*
• \`.autotyping on group\` – Enable in groups
• \`.autotyping off group\` – Disable in groups
• \`.autotyping on dm\` – Enable in DMs
• \`.autotyping off dm\` – Disable in DMs
• \`.autotyping status\` – Show current status`);
  }
});