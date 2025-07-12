const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a group with specified members.",
  filename: __filename,
  use: `${prefix}newgc GroupName + 254700000000,254711111111`,
  owner: true,
}, async (conn, mek, m, { body, sender, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("❌ Only the bot owner can use this command.");
    if (!body.includes("+")) return reply(`❌ Usage: ${prefix}newgc GroupName + 254xxxxxxx,254yyyyyyy`);

    const [groupNameRaw, numbersRaw] = body.split("+");
    const groupName = groupNameRaw.trim();
    const numberList = numbersRaw.split(",").map(n => n.trim()).filter(n => /^\d+$/.test(n));

    if (!groupName || numberList.length === 0) return reply("❌ Provide a group name and at least one valid number.");

    const participants = numberList.map(n => `${n}@s.whatsapp.net`);

    const group = await conn.groupCreate(groupName, participants);
    const inviteCode = await conn.groupInviteCode(group.id);

    await conn.groupUpdateDescription(group.id, `🌟 Group created by @${sender.split('@')[0]}`);

    await conn.sendMessage(group.id, {
      text: `👋 *Welcome to ${groupName}!* Group created by @${sender.split('@')[0]}`,
      mentions: [sender]
    });

    return reply(`╭━━━〔 *✅ GROUP CREATED SUCCESSFULLY* 〕━━⬣
┃📛 *Group name:* ${groupName}
┃👥 *Members added:* ${numberList.length}
┃
┃📎 *Invitation link:*
┃https://chat.whatsapp.com/${inviteCode}
╰━━━━━━━━━━━━━━━━━━━━⬣

✨ The group is now ready!
👤 You are the founder.
🚀 Invite more people with the link above.`);
    
  } catch (e) {
    console.error(e);
    return reply(`❌ *Error creating group!*\n\n*Details:* ${e.message}`);
  }
});