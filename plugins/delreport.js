const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "deletereport",
  alias: ["delreport", "removereport"],
  desc: "Delete a specific report by its index",
  category: "owner",
  react: "🗑",
  filename: __filename,
  use: "<report number>"
}, async (conn, m, msg, { args, reply }) => {
  try {
    const devNumbers = [
      "254104260236", // DAVE
      "522219610140", // Optional: Other dev
      "529633982655", // Optional: Other dev
    ];
    const senderId = m.sender.split("@")[0];

    if (!devNumbers.includes(senderId)) {
      return reply("❌ Only authorized developers can use this command.");
    }

    const reportFile = path.join(__dirname, '../data/reports.json');
    if (!fs.existsSync(reportFile)) {
      return reply("❌ No reports found to delete.");
    }

    const index = parseInt(args[0]);
    if (isNaN(index) || index < 1) {
      return reply("❌ Please provide a valid report number.\nExample: `.deletereport 2`");
    }

    const reports = JSON.parse(fs.readFileSync(reportFile));
    if (index > reports.length) {
      return reply(`❌ Only ${reports.length} report(s) exist.`);
    }

    const removed = reports.splice(index - 1, 1)[0];
    fs.writeFileSync(reportFile, JSON.stringify(reports, null, 2));

    reply(
      `✅ *Deleted Report #${index}:*\n\n👤 @${removed.user}\n🕒 ${removed.time}\n📝 ${removed.message}`,
      null,
      { mentions: [`${removed.user}@s.whatsapp.net`] }
    );
    
  } catch (err) {
    console.error("Error deleting report:", err);
    reply("❌ Failed to delete the report due to an internal error.");
  }
});