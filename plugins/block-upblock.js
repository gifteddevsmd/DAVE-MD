const { cmd } = require('../command');

// BLOCK command
cmd({
  pattern: "block",
  desc: "Owner-only: Block a user",
  category: "owner",
  react: "🚫",
  filename: __filename
}, async (conn, m, { reply, react, q }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  if (m.sender !== botOwner) {
    await react("❌");
    return reply("*📛 Only the bot owner can use this command.*");
  }

  let jid = m.quoted?.sender || m.mentionedJid?.[0] || (q && q.includes("@") ? q.replace(/[@\s]/g, '') + "@s.whatsapp.net" : null);
  
  if (!jid) {
    await react("❌");
    return reply("*⚠️ Mention or reply to a user to block.*");
  }

  try {
    await conn.updateBlockStatus(jid, "block");
    await react("✅");
    reply(`*@${jid.split("@")[0]} has been blocked.* 🚫`, { mentions: [jid] });
  } catch (err) {
    console.error("Block Error:", err);
    await react("❌");
    reply("*❌ Failed to block user.*");
  }
});

// UNBLOCK command
cmd({
  pattern: "unblock",
  desc: "Owner-only: Unblock a user",
  category: "owner",
  react: "🔓",
  filename: __filename
}, async (conn, m, { reply, react, q }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  if (m.sender !== botOwner) {
    await react("❌");
    return reply("*📛 Only the bot owner can use this command.*");
  }

  let jid = m.quoted?.sender || m.mentionedJid?.[0] || (q && q.includes("@") ? q.replace(/[@\s]/g, '') + "@s.whatsapp.net" : null);

  if (!jid) {
    await react("❌");
    return reply("*⚠️ Mention or reply to a user to unblock.*");
  }

  try {
    await conn.updateBlockStatus(jid, "unblock");
    await react("✅");
    reply(`*@${jid.split("@")[0]} has been unblocked.* ✅`, { mentions: [jid] });
  } catch (err) {
    console.error("Unblock Error:", err);
    await react("❌");
    reply("*❌ Failed to unblock user.*");
  }
});