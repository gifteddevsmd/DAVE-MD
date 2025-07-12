const { cmd } = require('../command');

cmd({
    pattern: "newsletter",
    desc: "Displays the @newsletter ID of the current channel",
    category: "tools",
    react: "馃摪",
    filename: __filename
},
async (conn, mek, m) => {
    const newsletterJid = m.chat;

    // Journaliser l'utilisation de la commande
    console.log(`[NEWSLETTER] Command used in: ${newsletterJid}`);

    if (!newsletterJid.endsWith("@newsletter")) {
        return conn.sendMessage(newsletterJid, {
            text: "This command must be used inside a WhatsApp channel (@newsletter)."
        }, { quoted: mek });
    }

    // Optionnel : V茅rifie si le JID semble valide (commence par "120")
    if (!newsletterJid.startsWith("120")) {
        return conn.sendMessage(newsletterJid, {
            text: "This does not appear to be a valid WhatsApp channel ID."
        }, { quoted: mek });
    }

    // Date et heure actuelle
    const now = new Date().toLocaleString();

    // Affiche l'ID du canal + date
    await conn.sendMessage(newsletterJid, {
        text: `Channel ID:\n\n*${newsletterJid}*\n\n馃晵 *Executed on:* ${now}`
    }, { quoted: mek });

    // Simule un message transf茅r茅 d鈥檜n autre canal
    const fakeNewsletterJid = '120363400480173280@newsletter';
    const fakeNewsletterName = '𝐃𝐀𝐕𝐄-𝐌𝐃 𝐔𝐩𝐝𝐚𝐭𝐞𝐬';
    const serverMessageId = 101;
    const message = `Forwarded from another newsletter:\n\n*${newsletterJid}*`;

    await conn.sendMessage(
        newsletterJid,
        {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: fakeNewsletterJid,
                    newsletterName: fakeNewsletterName,
                    serverMessageId: serverMessageId
                }
            }
        },
        { quoted: mek }
    );
});
