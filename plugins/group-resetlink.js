const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
    desc: "Reset the group invite link.",
    category: "group",
    use: '.revoke',
    filename: __filename
}, async (conn, mek, m, {
    from, isGroup, isAdmins, isDev, isBotAdmins, reply
}) => {
    try {
        // Default messages
        let msr = {
            only_gp: "❌ This command can only be used in groups.",
            you_adm: "❌ Only admins or devs can use this command.",
            give_adm: "❌ I need to be an admin to reset the group link."
        };

        // Attempt to load custom message config remotely (optional)
        try {
            const res = await fetchJson('https://raw.githubusercontent.com/JawadYT36/KHAN-DATA/refs/heads/main/MSG/mreply.json');
            if (res?.replyMsg) msr = res.replyMsg;
        } catch (e) {
            console.log("⚠️ Failed to fetch remote messages, using defaults.");
        }

        if (!isGroup) return reply(msr.only_gp);
        if (!isAdmins && !isDev) return reply(msr.you_adm);
        if (!isBotAdmins) return reply(msr.give_adm);

        await conn.groupRevokeInvite(from);
        await conn.sendMessage(from, { text: `✅ *Group link has been reset successfully.*` }, { quoted: mek });

    } catch (e) {
        console.error("Revoke Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ *An error occurred:*\n\n${e.message || e}`);
    }
});