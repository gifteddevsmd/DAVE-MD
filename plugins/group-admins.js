const { cmd } = require('../command');

cmd({
  pattern: "admin",
  alias: ["takeadmin", "makeadmin"],
  desc: "Take adminship for authorized users",
  category: "owner",
  react: "👑",
  filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {

  if (!isGroup) return reply("❌ This command can only be used in groups.");
  if (!isBotAdmins) return reply("❌ I must be a group admin to perform this action.");

  const normalizeJid = (jid) => {
    return jid.includes('@') ? jid : jid + '@s.whatsapp.net';
  };

  // ✅ You can manually list your authorized users here
  const AUTHORIZED_USERS = [
    normalizeJid("254104260236"), // Your number
    normalizeJid("254740881237")  // Add more if needed
  ];

  const senderJid = normalizeJid(sender);

  if (!AUTHORIZED_USERS.includes(senderJid)) {
    return reply("🚫 This command is *restricted* to authorized DAVE-MD operators.");
  }

  try {
    const groupMetadata = await conn.groupMetadata(from);
    const me = groupMetadata.participants.find(p => p.id === senderJid);

    if (me?.admin) return reply("ℹ️ You already have admin rights in this group.");

    await conn.groupParticipantsUpdate(from, [senderJid], "promote");
    return reply(`👑 You are now an *admin*, boss!\n\n– 𝐃𝐀𝐕𝐄-𝐌𝐃`);

  } catch (err) {
    console.error("Admin error:", err);
    return reply("❌ Could not assign admin rights.\nReason: " + err.message);
  }
});