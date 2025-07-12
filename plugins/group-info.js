const { cmd } = require('../command');

cmd({
  pattern: "ginfo",
  alias: ["groupinfo"],
  desc: "Get group information.",
  react: "🥏",
  category: "group",
  filename: __filename
},
async (conn, mek, m, {
  from, isGroup, isAdmins, isBotAdmins, participants, groupMetadata, reply, isDev, isOwner
}) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins && !isDev && !isOwner) return reply("❌ Only group admins or bot owner can use this.");
    if (!isBotAdmins) return reply("❌ I need to be admin to access group details.");

    // Custom branded fallback PPG
    let ppUrl = 'https://files.catbox.moe/vr83h2.jpg';
    try {
      ppUrl = await conn.profilePictureUrl(from, 'image');
    } catch (_) {} // Ignore if no profile photo

    const metadata = await conn.groupMetadata(from);
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
    const owner = metadata.owner || groupAdmins[0]?.id || 'unknown';

    const gdata = `🌐 *「 Group Information 」*

🧷 *Name:* ${metadata.subject}
🔗 *GID:* ${metadata.id}
👥 *Members:* ${metadata.size}
👑 *Owner:* ${owner !== 'unknown' ? '@' + owner.split('@')[0] : 'unknown'}
📝 *Description:* ${metadata.desc || 'No description'}

🛡️ *Admins:*
${listAdmin}

────────────────────
🔗 *Channel:* https://whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k
👨🏾‍💻 *Bot:* 𝐃𝐀𝐕𝐄-𝐌𝐃
`;

    await conn.sendMessage(from, {
      image: { url: ppUrl },
      caption: gdata,
      mentions: groupAdmins.map(a => a.id).concat(owner !== 'unknown' ? [owner] : [])
    }, { quoted: mek });

  } catch (e) {
    console.error("Group info error:", e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply("❌ Failed to fetch group info.");
  }
});