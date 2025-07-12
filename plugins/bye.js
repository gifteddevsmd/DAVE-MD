const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// Path to store per-group bye settings
const file = path.join(__dirname, "../data/bye-groups.json");
if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
let byeGroups = JSON.parse(fs.readFileSync(file));

// Save function
const saveByeGroups = () => fs.writeFileSync(file, JSON.stringify(byeGroups, null, 2));

// Command to toggle bye on/off
cmd({
  pattern: "bye",
  desc: "Turn goodbye message on/off",
  category: "group",
  filename: __filename
}, async (conn, m, { isGroup, isAdmins, args, reply }) => {
  if (!isGroup) return reply("⚠️ This command is for groups only.");
  if (!isAdmins) return reply("❌ Only group admins can use this.");

  const input = args[0]?.toLowerCase();
  if (input === "on") {
    if (!byeGroups.includes(m.chat)) {
      byeGroups.push(m.chat);
      saveByeGroups();
    }
    return reply("✅ *Bye message enabled* for this group.");
  } else if (input === "off") {
    byeGroups = byeGroups.filter(g => g !== m.chat);
    saveByeGroups();
    return reply("🚫 *Bye message disabled* for this group.");
  } else {
    return reply(`📌 *Usage:* .bye on / .bye off\n\nCurrent status: *${byeGroups.includes(m.chat) ? 'ON' : 'OFF'}*`);
  }
});

// Listen to participants leaving group
module.exports = async function handleBye(conn) {
  conn.ev.on("group-participants.update", async (update) => {
    if (!byeGroups.includes(update.id)) return;

    for (const user of update.participants) {
      if (update.action === "remove") {
        let profile;
        try {
          profile = await conn.profilePictureUrl(user, "image");
        } catch {
          profile = "https://files.catbox.moe/vr83h2.jpg"; // fallback
        }

        const mention = [user];
        const name = user.split("@")[0];

        await conn.sendMessage(update.id, {
          image: { url: profile },
          caption: `👋 *@${name} left the group.*\nGoodbye and best wishes!`,
          mentions: mention
        });
      }
    }
  });
};