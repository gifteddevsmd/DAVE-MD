const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
  pattern: "githubstalk",
  desc: "Fetch detailed GitHub user profile including profile picture.",
  category: "menu",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    const username = args[0];
    if (!username) {
      return reply("⚠️ Please provide a GitHub username.\n\nExample: `.githubstalk gifteddevsmd`");
    }

    const apiUrl = `https://api.github.com/users/${username}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    let userInfo = `👤 *Username*: ${data.name || data.login}
🔗 *GitHub URL*: ${data.html_url}
📝 *Bio*: ${data.bio || 'Not available'}
🌍 *Location*: ${data.location || 'Unknown'}
📊 *Public Repos*: ${data.public_repos}
👥 *Followers*: ${data.followers} | Following: ${data.following}
📅 *Created At*: ${new Date(data.created_at).toDateString()}
🛰️ *Public Gists*: ${data.public_gists}

🚀 *Powered by 𝐃𝐀𝐕𝐄-𝐌𝐃*`;

    await conn.sendMessage(from, {
      image: { url: data.avatar_url },
      caption: userInfo
    }, { quoted: mek });

  } catch (e) {
    console.error("GitHub Stalk Error:", e);
    reply(`❌ Error: ${e.response ? e.response.data.message : e.message}`);
  }
});