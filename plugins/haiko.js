const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "dave",
    alias: ["thanksto", "credit"],
    desc: "Thanks to the dev of DAVE-MD",
    category: "main",
    react: "🗯️",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const message =`╭━━━⪨𝐃𝐀𝐕𝐄-𝐌𝐃⪩━━━╮
┃╭╼━━━━━━━━━━━━┈⊷
┃┃👨‍💻 𝗗𝗘𝗩: 𝐃𝐀𝐕𝐄
┃┃🪀 𝗖𝗢𝗡𝗧𝗔𝗖𝗧: wa.me/254104260236
┃┃🛠️ 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: 𝐃𝐀𝐕𝐄-𝐌𝐃
┃┃📢 𝗖𝗛𝗔𝗡𝗡𝗘𝗟: whatsapp.com/channel/0029VbApvFQ2Jl84lhONkc3k
┃┃💻 𝗚𝗜𝗧𝗛𝗨𝗕: github.com/gifteddaves/DAVE-MD
┃┃🙋‍♂️ 𝗨𝗦𝗘𝗥: @${m.sender.split("@")[0]}
┃╰╼━━━━━━━━━━━━┈⊷
╰╼═════════════════╾╯
> *𝐏𝐎𝗪𝐄𝐑𝐄𝐃 𝐁𝐘 𝐃𝐀𝐕𝐄-𝐌𝐃*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/vr83h2.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363398101781980@newsletter',
                    newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("DAVE-MD Thanks Error:", err);
        await conn.sendMessage(from, { text: `Error: ${err.message}` }, { quoted: mek });
    }
});