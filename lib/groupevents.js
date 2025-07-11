const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
});

const fallbackPp = 'https://files.catbox.moe/em1yu3.jpg';

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id)) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No description available.";
        const memberCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = fallbackPp;
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();
            const mentions = [num];

            if (update.action === "add" && config.WELCOME === "true") {
                const welcomeText = `👋 Hey @${userName},\nWelcome to *${metadata.subject}*! 🎉\n\n` +
                    `You're member #${memberCount}.\n` +
                    `Joined: *${timestamp}*\n\n` +
                    `📜 Group Description:\n${desc}\n\n` +
                    `— Powered by *${config.BOT_NAME}*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: welcomeText,
                    mentions,
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const goodbyeText = `👋 Goodbye @${userName}.\n` +
                    `Left: *${timestamp}*\n` +
                    `Remaining members: ${memberCount}`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: goodbyeText,
                    mentions,
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author?.split("@")[0] || "Unknown";
                await conn.sendMessage(update.id, {
                    text: `🔻 Admin Demotion\n\n@${demoter} demoted @${userName}.\nTime: ${timestamp}\nGroup: *${metadata.subject}*`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author?.split("@")[0] || "Unknown";
                await conn.sendMessage(update.id, {
                    text: `🔺 Admin Promotion\n\n@${promoter} promoted @${userName} to admin. 🎉\nTime: ${timestamp}\nGroup: *${metadata.subject}*`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('❌ Group Event Error:', err);
    }
};

module.exports = GroupEvents;
