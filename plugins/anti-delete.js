const config = require("../config");
const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

// Ensure settings are initialized once
initializeAntiDeleteSettings();

cmd({
  pattern: "antidelete",
  alias: ['antidel', 'antid'],
  desc: "Toggle Anti-Delete system",
  category: "misc",
  filename: __filename
},
async (conn, mek, m, { reply, q, from, isOwner }) => {
  if (!isOwner) {
    return await conn.sendMessage(from, {
      text: "*📛 Only the bot owner can use this command.*"
    }, { quoted: mek });
  }

  try {
    const command = q?.toLowerCase();

    switch (command) {
      case 'on':
        await setAnti('gc', true);
        await setAnti('dm', true);
        return reply('✅ Anti-delete enabled for both groups and private chats.');

      case 'off gc':
        await setAnti('gc', false);
        return reply('🚫 Anti-delete disabled for groups.');

      case 'off dm':
        await setAnti('dm', false);
        return reply('🚫 Anti-delete disabled for private chats.');

      case 'set gc':
        const gcStatus = await getAnti('gc');
        await setAnti('gc', !gcStatus);
        return reply(`🔁 Group Anti-delete is now *${!gcStatus ? 'enabled' : 'disabled'}*.`);

      case 'set dm':
        const dmStatus = await getAnti('dm');
        await setAnti('dm', !dmStatus);
        return reply(`🔁 DM Anti-delete is now *${!dmStatus ? 'enabled' : 'disabled'}*.`);

      case 'set all':
        await setAnti('gc', true);
        await setAnti('dm', true);
        return reply('✅ Anti-delete activated across all chats.');

      case 'status':
        const currentDmStatus = await getAnti('dm');
        const currentGcStatus = await getAnti('gc');
        return reply(
          `📊 *Anti-Delete Status:*\n\n` +
          `• Group Chats: *${currentGcStatus ? 'Enabled' : 'Disabled'}*\n` +
          `• Private Chats: *${currentDmStatus ? 'Enabled' : 'Disabled'}*`
        );

      default:
        return reply(
`🛡️ *AntiDelete Command Guide:*

• \`.antidelete on\` – Enable globally
• \`.antidelete off gc\` – Disable for groups
• \`.antidelete off dm\` – Disable for private chats
• \`.antidelete set gc\` – Toggle for groups
• \`.antidelete set dm\` – Toggle for private chats
• \`.antidelete set all\` – Enable everywhere
• \`.antidelete status\` – View current status`
        );
    }

  } catch (e) {
    console.error("❌ AntiDelete Error:", e);
    return reply("❌ An error occurred while toggling AntiDelete settings.");
  }
});