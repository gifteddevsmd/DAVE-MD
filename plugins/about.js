const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "about",
    alias: "dev",
    react: "👑",
    desc: "Get developer info",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        const botJid = conn.user.id || "0@s.whatsapp.net";
        const botNumber = botJid.split("@")[0]; // extract number from jid

        let about = `> *_𝐓𝐡𝐞 𝐁𝐞𝐬𝐭 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐁𝐨𝐭 — 𝐃𝐀𝐕𝐄-𝐌𝐃_*
╭╼━❍ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 ❍
┃│❍ *Created by ➭ Gifted Dave 🌚*
┃│❍ *Bot name ➭ 𝐃𝐀𝐕𝐄-𝐌𝐃*
┃│❍ *Status ➭ Active ✅*
┃│❍ *Platform ➭ WhatsApp Bot*
┃╰────────────────
╰╼━━━━━━━━━━━━━━━━╾╯
╭╼━❍ 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 ❍
┃│❍➳ *Name ➭ Gifted Dave 🌚*
┃│❍➳ *Contact ➭ wa.me/${botNumber}*
┃│❍➳ *GitHub ➭ https://github.com/giftedsession/DAVE-MD*
┃╰────────────────
╰╼━━━━━━━━━━━━━━━━╾╯
> *Powered by 𝐆𝐢𝐟𝐭𝐞𝐝 𝐃𝐚𝐯𝐞 ☕️🚀*`

        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/5WCmzFS6/4367.jpg' },
            caption: about,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363398101781980@newsletter',
                    newsletterName: '𝐃𝐀𝐕𝐄-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
