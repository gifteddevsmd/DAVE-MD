const { cmd } = require('../command');

cmd({
  pattern: "demote",
  alias: ["d", "dismiss", "removeadmin"],
  desc: "Demotes a group admin to a normal member",
  category: "admin",
  react: "⬇️",
  filename: __filename
},
async (conn, mek, m, {
  from, quoted, q, isGroup, sender, botNumber, isOwner, isAdmins, isBotAdmins, groupMetadata, reply
}) => {
  if (!isGroup) return reply("❌ This command can only be used in groups.");
  if (!isAdmins) return reply("❌ Only group admins can use this command.");
  if (!isBotAdmins) return reply("❌ I must be an admin to demote someone.");

  let number;
  if (quoted) {
    number = quoted.sender.split("@")[0];
  } else if (q && q.includes("@")) {
    number = q.replace(/[@\s+]/g, '');
  } else {
    return reply("❌ Please reply to a message or mention a user to demote.");
  }

  const jid = number + "@s.whatsapp.net";

  // Prevent bot or group creator from being demoted
  if (jid === botNumber) return reply("❌ I can't demote myself.");
  if (groupMetadata.owner === jid) return reply("🚫 I can't demote the group owner.");

  try {
    await conn.groupParticipantsUpdate(from, [jid], "demote");
    reply(`⬇️ Successfully demoted @${number} to a normal member.\n\n– 𝐃𝐀𝐕𝐄-𝐌𝐃`, { mentions: [jid] });
  } catch (err) {
    console.error("Demote error:", err);
    reply("❌ Failed to demote the member.\nReason: " + err.message);
  }
});