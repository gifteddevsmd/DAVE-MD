const fs = require('fs');
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: 'savecontact',
  alias: ["vcf", "scontact", "savecontacts"],
  desc: 'Save group contacts as .vcf file',
  category: 'group',
  filename: __filename
}, async (conn, mek, m, {
  from, quoted, isGroup, isOwner, reply, groupMetadata
}) => {
  try {
    if (!isGroup) return reply("📛 *This command only works in groups!*");
    if (!isOwner) return reply("👑 *Only the bot owner can use this.*");

    const groupInfo = groupMetadata;
    const participants = groupInfo.participants;

    let vcard = '';
    let counter = 1;

    for (let user of participants) {
      const num = user.id.split("@")[0];
      vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${counter++}] +${num}\nTEL;type=CELL;type=VOICE;waid=${num}:+${num}\nEND:VCARD\n`;
    }

    const filePath = './contacts.vcf';
    fs.writeFileSync(filePath, vcard.trim());

    reply(`📥 Saving *${participants.length}* contacts from *${groupInfo.subject}*...`);

    await sleep(2000); // Wait before sending

    await conn.sendMessage(from, {
      document: fs.readFileSync(filePath),
      mimetype: 'text/vcard',
      fileName: '𝐃𝐀𝐕𝐄-𝐌𝐃-contacts.vcf',
      caption: `✅ Successfully exported *${participants.length}* contacts from *${groupInfo.subject}*\n\n📁 Format: *.vcf*\n👑 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐕𝐄-𝐌𝐃`
    }, { quoted: mek });

    fs.unlinkSync(filePath); // Delete temp file
  } catch (err) {
    console.error(err);
    reply("❌ Error:\n" + err.toString());
  }
});
