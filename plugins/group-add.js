const { cmd } = require('../command');

cmd({
  pattern: "add",
  alias: ["a", "ad"],
  desc: "Adds a member to the group",
  category: "group",
  react: "➕",
  filename: __filename
},
async (conn, mek, m, {
  from, q, isGroup, isBotAdmins, reply, quoted, isOwner
}) => {
  if (!isGroup) return reply("❌ This command only works in groups.");

  if (!isOwner) return reply("🚫 Only the bot *owner* can use this command.");

  if (!isBotAdmins) return reply("⚠️ I must be a *group admin* to add members.");

  let number;
  if (m.quoted) {
    number = m.quoted.sender.split("@")[0];
  } else if (q && q.includes("@")) {
    number = q.replace(/[@\s]/g, '');
  } else if (q && /^\d+$/.test(q)) {
    number = q;
  } else {
    return reply("❓ Please reply to a message, mention a user, or provide a number to add.");
  }

  const jid = number + "@s.whatsapp.net";

  try {
    await conn.groupParticipantsUpdate(from, [jid], "add");
    reply(`✅ @${number} has been added.\n\n🤖 *𝐃𝐀𝐕𝐄-𝐌𝐃 at your service*`, {
      mentions: [jid]
    });
  } catch (error) {
    console.error("Add command error:", error);
    reply("❌ Could not add that number. It might be blocked or invalid.");
  }
});