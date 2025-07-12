const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: 'version',
  alias: ['changelog', 'cupdate', 'checkupdate'],
  react: '🚀',
  desc: "Check bot's version, system stats, and update info.",
  category: 'info',
  filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
  try {
    const localVersionPath = path.join(__dirname, '../data/version.json');
    let localVersion = 'Unknown';
    let changelog = 'No changelog available.';

    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    const rawVersionUrl = 'https://raw.githubusercontent.com/giftedsession/DAVE-MD/main/data/version.json';
    let latestVersion = 'Unknown';
    let latestChangelog = 'No changelog available.';
    try {
      const { data } = await axios.get(rawVersionUrl);
      latestVersion = data.version;
      latestChangelog = data.changelog;
    } catch (err) {
      console.error('❌ Failed to fetch latest version:', err.message);
    }

    const pluginCount = fs.readdirSync(path.join(__dirname, '../plugins')).filter(f => f.endsWith('.js')).length;
    const totalCommands = commands.length;

    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    const lastUpdate = fs.existsSync(localVersionPath)
      ? fs.statSync(localVersionPath).mtime.toLocaleString()
      : 'Unknown';

    const githubRepo = 'https://github.com/giftedsession/DAVE-MD';

    const updateMsg = (localVersion !== latestVersion)
      ? `🚀 *Your bot is outdated!*\n🔹 *Current:* ${localVersion}\n🔹 *Latest:* ${latestVersion}\n\nType *.update* to get latest.`
      : `✅ 𝐃𝐀𝐕𝐄-𝐌𝐃 is up-to-date!`;

    const statusMessage = `
> *𝐕𝐄𝐑𝐒𝐈𝐎𝐍 𝐂𝐇𝐄𝐂𝐊 — 𝐃𝐀𝐕𝐄-𝐌𝐃*
╭───⭓ 𝘼𝙗𝙤𝙪𝙩
│👋 Hello, *${pushname || 'User'}*
│🤖 Bot: 𝐃𝐀𝐕𝐄-𝐌𝐃
│📦 Version: *${localVersion}* ➤ *${latestVersion}*
│📂 Plugins: *${pluginCount}*
│🔢 Commands: *${totalCommands}*
│📍 Host: *${hostName}*
╰───⭓

╭───⭓ 𝙎𝙮𝙨𝙩𝙚𝙢
│🧠 RAM: ${ramUsage}MB / ${totalRam}MB
│🕐 Uptime: ${uptime}
│📅 Last Update: ${lastUpdate}
╰───⭓

🧾 *Update Info:*
${updateMsg}

🌐 GitHub: ${githubRepo}
⭐ Star and Fork it now!
`;

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/cad2f0.jpg' },
      caption: statusMessage.trim(),
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

  } catch (error) {
    console.error('❌ Version check failed:', error.message);
    reply('❌ An error occurred while checking bot version.');
  }
});