const { cmd } = require('../command');

// Command to list all pending group join requests
cmd({
  pattern: "requestlist",
  desc: "Shows pending group join requests",
  category: "group",
  react: "📋",
  filename: __filename
},
async (conn, mek, m, {
  from, isGroup, isAdmins, isBotAdmins, reply
}) => {
  try {
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");
    if (!isBotAdmins) return reply("❌ I need to be a group admin to check requests.");

    const requests = await conn.groupRequestParticipantsList(from);
    if (!requests.length) return reply("📭 No pending join requests.");

    let text = `📋 *Pending Join Requests (${requests.length})*\n\n`;
    requests.forEach((u, i) => {
      text += `${i + 1}. @${u.jid.split('@')[0]}\n`;
    });

    return reply(text + `\n\n🤖 *Powered by 𝐃𝐀𝐕𝐄-𝐌𝐃*`, {
      mentions: requests.map(u => u.jid)
    });
  } catch (error) {
    console.error("Request list error:", error);
    return reply("❌ Failed to fetch join requests. Try again.");
  }
});

// Accept all pending join requests
cmd({
  pattern: "acceptall",
  desc: "Accepts all pending group join requests",
  category: "group",
  react: "✅",
  filename: __filename
},
async (conn, mek, m, {
  from, isGroup, isAdmins, isBotAdmins, reply
}) => {
  try {
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    if (!isGroup) return reply("❌ Group only command.");
    if (!isAdmins) return reply("❌ Only admins can use this.");
    if (!isBotAdmins) return reply("❌ I need admin rights to accept requests.");

    const requests = await conn.groupRequestParticipantsList(from);
    if (!requests.length) return reply("📭 No pending requests to accept.");

    const jids = requests.map(u => u.jid);
    await conn.groupRequestParticipantsUpdate(from, jids, "approve");

    return reply(`✅ Accepted ${jids.length} requests.\n\n🤖 *𝐃𝐀𝐕𝐄-𝐌𝐃 at your service!*`);
  } catch (error) {
    console.error("Accept all error:", error);
    return reply("❌ Could not accept requests. Try again.");
  }
});

// Reject all pending group join requests
cmd({
  pattern: "rejectall",
  desc: "Rejects all pending group join requests",
  category: "group",
  react: "❌",
  filename: __filename
},
async (conn, mek, m, {
  from, isGroup, isAdmins, isBotAdmins, reply
}) => {
  try {
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    if (!isGroup) return reply("❌ This only works in groups.");
    if (!isAdmins) return reply("❌ You must be an admin.");
    if (!isBotAdmins) return reply("❌ Bot needs admin rights.");

    const requests = await conn.groupRequestParticipantsList(from);
    if (!requests.length) return reply("📭 No requests to reject.");

    const jids = requests.map(u => u.jid);
    await conn.groupRequestParticipantsUpdate(from, jids, "reject");

    return reply(`✅ Rejected ${jids.length} requests.\n\n🔒 *Done by 𝐃𝐀𝐕𝐄-𝐌𝐃*`);
  } catch (error) {
    console.error("Reject all error:", error);
    return reply("❌ Something went wrong while rejecting requests.");
  }
});