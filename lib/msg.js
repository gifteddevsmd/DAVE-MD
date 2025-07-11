const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');

const downloadMediaMessage = async (m, filename) => {
    let name;
    let type = m.type === 'viewOnceMessage' ? m.msg.type : m.type;
    const stream = await downloadContentFromMessage(m.msg, type.replace('Message', ''));

    const extMap = {
        imageMessage: '.jpg',
        videoMessage: '.mp4',
        audioMessage: '.mp3',
        stickerMessage: '.webp',
        documentMessage: `.${m.msg?.fileName?.split('.').pop()?.toLowerCase().replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3') || 'doc'}`
    };

    name = filename ? filename + extMap[type] : 'undefined' + extMap[type];
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    fs.writeFileSync(name, buffer);
    return fs.readFileSync(name);
};

const sms = (conn, m, store) => {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    if (m.key) {
        m.id = m.key.id;
        m.isBot = m.id.startsWith('BAES') && m.id.length === 16;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = m.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid;
    }

    if (m.message) {
        m.mtype = getContentType(m.message);
        m.msg = (m.mtype === 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
        try {
            m.body = m.message.conversation || m.msg.caption || m.msg.text || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || '';
        } catch {
            m.body = '';
        }

        let quoted = m.quoted = m.msg.contextInfo?.quotedMessage || null;
        m.mentionedJid = m.msg.contextInfo?.mentionedJid || [];

        if (quoted) {
            let type = getContentType(quoted);
            m.quoted = quoted[type];

            if (['productMessage'].includes(type)) {
                type = getContentType(m.quoted);
                m.quoted = m.quoted[type];
            }
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };

            m.quoted.mtype = type;
            m.quoted.id = m.msg.contextInfo.stanzaId;
            m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
            m.quoted.isBot = m.quoted.id?.startsWith('BAES');
            m.quoted.isBaileys = m.quoted.id?.startsWith('BAE5');
            m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant);
            m.quoted.fromMe = m.quoted.sender === (conn.user?.id);
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || '';

            m.getQuotedObj = m.getQuotedMessage = async () => {
                if (!m.quoted.id) return false;
                let q = await store.loadMessage(m.chat, m.quoted.id, conn);
                return exports.sms(conn, q, store);
            };

            const key = {
                remoteJid: m.chat,
                fromMe: false,
                id: m.quoted.id,
                participant: m.quoted.sender
            };

            m.quoted.delete = async () => await conn.sendMessage(m.chat, { delete: key });

            const vM = m.quoted.fakeObj = M.fromObject({
                key,
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            });

            m.forwardMessage = (jid, forceForward = true, options = {}) =>
                conn.copyNForward(jid, vM, forceForward, { contextInfo: { isForwarded: false } }, options);

            m.quoted.download = () => conn.downloadMediaMessage(m.quoted);
        }
    }

    if (m.msg?.url) m.download = () => conn.downloadMediaMessage(m.msg);
    m.text = m.body;

    m.copy = () => exports.sms(conn, M.fromObject(M.toObject(m)));
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options);
    m.sticker = (stik, id = m.chat, option = { mentions: [m.sender] }) =>
        conn.sendMessage(id, { sticker: stik, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });

    m.replyimg = (img, teks, id = m.chat, option = { mentions: [m.sender] }) =>
        conn.sendMessage(id, { image: img, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });

    m.imgurl = (img, teks, id = m.chat, option = { mentions: [m.sender] }) =>
        conn.sendMessage(id, { image: { url: img }, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m });

    m.reply = async (content, opt = { packname: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃", author: "giftedsession" }, type = "text") => {
        switch (type.toLowerCase()) {
            case "text":
                return await conn.sendMessage(m.chat, { text: content }, { quoted: m });
            case "image":
                return Buffer.isBuffer(content)
                    ? await conn.sendMessage(m.chat, { image: content, ...opt }, { ...opt })
                    : await conn.sendMessage(m.chat, { image: { url: content }, ...opt }, { ...opt });
            case "video":
                return Buffer.isBuffer(content)
                    ? await conn.sendMessage(m.chat, { video: content, ...opt }, { ...opt })
                    : await conn.sendMessage(m.chat, { video: { url: content }, ...opt }, { ...opt });
            case "audio":
                return Buffer.isBuffer(content)
                    ? await conn.sendMessage(m.chat, { audio: content, ...opt }, { ...opt })
                    : await conn.sendMessage(m.chat, { audio: { url: content }, ...opt }, { ...opt });
        }
    };

    m.senddoc = (doc, type, id = m.chat, option = {
        mentions: [m.sender],
        filename: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
        mimetype: type,
        externalAdRepl: {
            title: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
            body: 'Official GitHub:',
            thumbnailUrl: '',
            thumbnail: log0,
            mediaType: 1,
            mediaUrl: '',
            sourceUrl: 'https://github.com/giftedsession/DAVE-MD',
        }
    }) =>
        conn.sendMessage(id, {
            document: doc,
            mimetype: option.mimetype,
            fileName: option.filename,
            contextInfo: {
                externalAdReply: option.externalAdRepl,
                mentionedJid: option.mentions
            }
        }, { quoted: m });

    m.sendcontact = (name, info, number) => {
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`;
        conn.sendMessage(m.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: m });
    };

    m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });

    return m;
};

module.exports = { sms, downloadMediaMessage };
