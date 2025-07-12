
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const pkg = require('../package.json');

cmd({
  pattern: "uptime",
  alias: ["runtime", "run"],
  desc: "Show bot uptime with stylish formats",
  category: "main",
  react: "⏱️",
  filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    const uptime = runtime(process.uptime());
    const seconds = Math.floor(process.uptime());
    const startTime = new Date(Date.now() - seconds * 1000);
    const version = pkg.version || "1.0.0";

    const styles = [
`╭───『 *UPTIME* 』───╮
│ ⏱️ ${uptime}
│ 🔢 ${seconds} seconds
│ 🚀 Started: ${startTime.toLocaleString()}
╰────────────────╯
> *𝐃𝐀𝐕𝐄-𝐌𝐃 𝐒𝐓𝐀𝐓𝐔𝐒*`,

`╭╼═⧼ 𝐔𝐏𝐓𝐈𝐌𝐄 𝐒𝐓𝐀𝐓𝐒 ⧽═╾╮
┃  🕰️ Time: ${uptime}
┃  🔢 Seconds: ${seconds}
┃  🗓️ Since: ${startTime.toLocaleDateString()}
╰╼════════════╾╯
> *𝐃𝐀𝐕𝐄-𝐌𝐃*`,

`╭╼━━━━━━━━━━━━╾╮
│   *⟬ 𝐔𝐏𝐓𝐈𝐌𝐄 ⟭*  
│  • Time: ${uptime}
│  • Seconds: ${seconds}
│  • Started: ${startTime.toLocaleString()}
╰╼━━━━━━━━━━━━╾╯
> *𝐃𝐀𝐕𝐄-𝐌𝐃*`,

`╭─⧼ 🅤🅟🅣🅘🅜🅔 ⧽─╮
│ ⏳ ${uptime}
│ 🕰️ ${startTime.toLocaleString()}
│ 🔢 ${seconds} seconds
╰──────────────╯
> *𝐃𝐀𝐕𝐄-𝐌𝐃*`,

`╭╼═══ 𝐃𝐀𝐕𝐄-𝐌𝐃 ═══╾╮
│ ⏱️ Runtime: ${uptime}
│ ⏲️ Seconds: ${seconds}
│ 🗓️ Started: ${startTime.toLocaleString()}
╰══════════════════╯`,

`╭━━━━━━━━━━━━━━╮
┃  𝐔𝐏𝐓𝐈𝐌𝐄 𝐒𝐓𝐀𝐓𝐔𝐒  
┃  ᴅᴜʀᴀᴛɪᴏɴ: ${uptime}
┃  sᴇᴄᴏɴᴅs: ${seconds}
┃  ᴛɪᴍᴇ: ${startTime.toLocaleString()}
┃  sᴛᴀʙɪʟɪᴛʏ: 100%
╰━━━━━━━━━━━━━━╯
> *𝐃𝐀𝐕𝐄-𝐌𝐃 𝐑𝐔𝐍𝐍𝐈𝐍𝐆*`,

`╭━╾ ᴜᴘᴛɪᴍᴇ ʀᴇᴘᴏʀᴛ ╾━╮
┃ • ⌛ Uptime: ${uptime}
┃ • 🔢 Seconds: ${seconds}
┃ • 🕒 Start: ${startTime.toLocaleString()}
╰━╾ 𝐃𝐀𝐕𝐄-𝐌𝐃 ╾━╯`
    ];

    let selectedStyle;
    if (args[0] && args[0].toLowerCase().startsWith("style")) {
      const index = parseInt(args[0].replace("style", "")) - 1;
      if (!isNaN(index) && styles[index]) {
        selectedStyle = styles[index];
      } else {
        return reply(`❌ Style not found.\n✅ Try: style1 to style${styles.length}`);
      }
    } else {
      selectedStyle = styles[Math.floor(Math.random() * styles.length)];
    }

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/eafhsi.jpg' },
      caption: selectedStyle,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃 𝐔𝐩𝐝𝐚𝐭𝐞𝐬',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});