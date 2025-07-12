const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "📦",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/giftedsession/DAVE-MD';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Error: Invalid GitHub repo URL.");

        const [, username, repoName] = match;

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
            headers: {
                'User-Agent': 'DAVE-MD-BOT'
            }
        });

        if (response.status === 503) {
            return reply("❌ GitHub is temporarily unavailable. Please try again later.");
        }

        if (!response.ok) {
            return reply(`❌ Failed to fetch repo info. Status Code: ${response.status}`);
        }

        const repoData = await response.json();

        const message = `╭──〔 *📦 𝐃𝐀𝐕𝐄-𝐌𝐃 𝐑𝐄𝐏𝐎* 〕──
│ 🔹 *Repository:* ${repoData.name}
│ 👨‍💻 *Owner:* ${repoData.owner.login}
│ ⭐ *Stars:* ${repoData.stargazers_count}
│ 🍴 *Forks:* ${repoData.forks_count}
│ 🔗 *URL:* ${repoData.html_url}
│ 📝 *Description:*
│ ${repoData.description || 'No description available.'}
╰─────────────────────╯
> 📞 Contact: wa.me/254104260236
> 🛠️ Powered by: *𝐃𝐀𝐕𝐄-𝐌𝐃*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/vr83h2.jpg' },
            caption: message,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply("❌ Error fetching repository info.");
    }
});