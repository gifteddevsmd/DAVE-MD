const axios = require("axios");

cmd({
  pattern: "report",
  alias: ["bug", "feedback"],
  desc: "Send a report or bug directly to the developer",
  category: "tools",
  filename: __filename,
},
async (conn, mek, m, { args, sender, pushName, reply }) => {
  const reportText = args.join(" ");
  if (!reportText)
    return reply("❌ Please enter your report.\n\n*Example:* `.report play command not working`");

  const message = `🚨 *New Report from DAVE-MD Bot*\n\n👤 *User:* wa.me/${sender.split("@")[0]}\n🧑 *Name:* ${pushName}\n📝 *Message:* ${reportText}`;

  try {
    await axios.post(`https://api.telegram.org/bot8056853440:AAEJwxMh9O-aBE5REm5rAuw585ZkKd_BP1Q/sendMessage`, {
      chat_id: "7006005831",
      text: message,
      parse_mode: "Markdown"
    });

    reply("✅ Your report has been sent successfully to the developer.");
  } catch (error) {
    console.error("Telegram report error:", error.message);
    reply("❌ Failed to send report. Please try again later.");
  }
});
