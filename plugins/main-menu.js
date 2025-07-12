const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

cmd({
  pattern: "menu",
  alias: ["allmenu", "help"],
  desc: "Show all bot commands",
  category: "main",
  react: "📖",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
  try {
    const totalCmds = commands.length;
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let menu = `╭──〔 *🌐 𝐃𝐀𝐕𝐄-𝐌𝐃 𝐌𝐄𝐍𝐔* 〕──╮
│ 👤 User: @${m.sender.split("@")[0]}
│ ⚙️ Mode: ${config.MODE}
│ 🧩 Plugins: ${totalCmds}
│ ⏱️ Uptime: ${uptime()}
│ 📅 Date: ${moment().tz("Africa/Nairobi").format("dddd, DD MMMM YYYY")}
╰──────────────────────╯`;

    // Group by categories
    let categories = {};
    for (const cmd of commands) {
      if (!cmd.category) continue;
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd);
    }

    const sorted = Object.keys(categories).sort();
    for (const category of sorted) {
      menu += `\n\n───▸ *${category.toUpperCase()}*\n`;
      for (const command of categories[category]) {
        menu += `▸ ${config.PREFIX}${command.pattern}\n`;
      }
    }

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/vr83h2.jpg' },
      caption: menu,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("❌ Error showing menu: " + err.message);
  }
});