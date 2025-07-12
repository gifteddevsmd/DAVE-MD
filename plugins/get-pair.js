const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
  pattern: 'getpair',
  alias: ['clonebot'],
  desc: 'Get WhatsApp Pairing Code',
  category: 'session',
  filename: __filename
}, async (message, conn, m, { q, reply }) => {
  try {
    if (!q || !/^\d{8,15}$/.test(q)) {
      return await reply("❌ PHONE NUMBER is incorrect.\n\nExample:\n.getpair 2547XXXXXXXX");
    }

    const res = await fetch(`https://davesxmd-03209e7609ef.herokuapp.com/code?number=${q}`);
    const json = await res.json();

    if (!json || !json.code) {
      return await reply("❌ Failed to retrieve pairing code. Try again later.");
    }

    const code = json.code;

    await reply(`*𝐃𝐀𝐕𝐄-𝐌𝐃 PAIRING CODE*\n\n📞 Number: ${q}\n🔑 Code: *${code}*\n\n📌 Please keep WhatsApp open and syncing.`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await reply(code);

  } catch (err) {
    console.error('PAIRING ERROR:', err);
    await reply("❌ An error occurred during the pairing process. Please try again.");
  }
});