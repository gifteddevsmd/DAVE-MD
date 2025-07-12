const { cmd } = require('../command');

cmd({
  pattern: "updategname",
  alias: ["upgname", "gname"],
  react: "📝",
  desc: "Change the group name.",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be an admin to update the group name.");
    if (!q) return reply("❌ Please provide a new group name.");

    await conn.groupUpdateSubject(from, q);
    reply(`✅ Group name has been updated to:\n*${q}*\n\n— 𝐃𝐀𝐕𝐄-𝐌𝐃`);
  } catch (e) {
    console.error("Group name update error:", e);
    reply("❌ Failed to update the group name. Try again later.");
  }
});