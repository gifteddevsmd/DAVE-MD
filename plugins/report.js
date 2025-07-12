require('dotenv').config(); // Load .env values

const fs = require('fs');
const axios = require('axios');
const path = require('path');

const REPORTS_FILE = path.join(__dirname, '../data/reports.json');
const TELEGRAM_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TG_CHAT_ID;

function saveReport(user, message) {
  const report = {
    user,
    message,
    timestamp: new Date().toISOString(),
  };

  let reports = [];

  if (fs.existsSync(REPORTS_FILE)) {
    reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  }

  reports.push(report);

  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  sendReportToTelegram(report); // send it securely
}

async function sendReportToTelegram({ user, message }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const text = `🛠️ *New Report Received*\n\n👤 User: \`${user}\`\n📝 Message: ${message}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error("❌ Failed to send report to Telegram:", err.message);
  }
}

module.exports = { saveReport };
