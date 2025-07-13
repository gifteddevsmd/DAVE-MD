const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "song",
    alias: ["s", "play"],
    react: "🎵",
    desc: "Download music from YouTube",
    category: "download",
    filename: __filename,
    use: ".song <title or YouTube URL>"
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song name or YouTube URL!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const search = await dy_scrap.ytsearch(q);
            if (!search?.results?.length) return reply("❌ No video found!");
            id = search.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return reply("❌ Could not fetch video metadata!");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        const messageText = `🍄 *𝚂𝙾𝙽𝙶 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* 🍄\n\n` +
            `🎵 *Title:* ${title || "N/A"}\n` +
            `⏳ *Duration:* ${timestamp || "N/A"}\n` +
            `👀 *Views:* ${views || "N/A"}\n` +
            `🌏 *Uploaded:* ${ago || "N/A"}\n` +
            `👤 *Channel:* ${author?.name || "N/A"}\n` +
            `🖇 *Link:* ${url || "N/A"}\n\n` +
            `🔽 *Reply with:* \n1 = Audio 🎵\n2 = Document 📁\n\n${config.FOOTER || "𝐃𝐀𝐕𝐄-𝐌𝐃"}`;

        const sent = await conn.sendMessage(from, {
            image: { url: image },
            caption: messageText
        }, { quoted: mek });

        const messageID = sent.key.id;

        // ONE-TIME LISTENER
        const handleReply = async (msg) => {
            try {
                const msgContent = msg?.messages?.[0];
                if (!msgContent?.message) return;

                const body = msgContent.message?.conversation || msgContent.message?.extendedTextMessage?.text;
                const isReply = msgContent.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReply) return;

                let typeMsg;
                let download;

                if (body.trim() === "1") {
                    const wait = await conn.sendMessage(from, { text: "🎧 Fetching Audio..." }, { quoted: mek });
                    download = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    const audioUrl = download?.result?.download?.url;
                    if (!audioUrl) return reply("❌ Audio not found!");

                    typeMsg = { audio: { url: audioUrl }, mimetype: "audio/mpeg" };

                    await conn.sendMessage(from, typeMsg, { quoted: mek });
                    await conn.sendMessage(from, { text: '✅ Audio Sent!', edit: wait.key });

                } else if (body.trim() === "2") {
                    const wait = await conn.sendMessage(from, { text: "📁 Preparing Document..." }, { quoted: mek });
                    download = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    const audioUrl = download?.result?.download?.url;
                    if (!audioUrl) return reply("❌ Download failed!");

                    typeMsg = {
                        document: { url: audioUrl },
                        fileName: `${title}.mp3`,
                        mimetype: "audio/mpeg",
                        caption: title
                    };

                    await conn.sendMessage(from, typeMsg, { quoted: mek });
                    await conn.sendMessage(from, { text: '✅ Sent as document!', edit: wait.key });

                } else {
                    return reply("❌ Invalid choice! Reply with 1 or 2.");
                }
            } catch (e) {
                console.log("Error in reply:", e);
                await reply("❌ Error while processing your choice.");
            }
        };

        conn.ev.once("messages.upsert", handleReply);

    } catch (error) {
        console.log("Song Command Error:", error);
        await reply(`❌ An error occurred:\n${error.message}`);
    }
});
