const axios = require('axios');

// 📦 Fetch Buffer (used for media downloads)
const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Requests': 1,
                ...(options.headers || {}),
            },
            responseType: 'arraybuffer',
            ...options
        });
        return res.data;
    } catch (e) {
        console.error("❌ getBuffer Error:", e.message);
        return null;
    }
};

// 👑 Extract group admins
const getGroupAdmins = (participants = []) => {
    return participants
        .filter(p => p.admin !== null)
        .map(p => p.id);
};

// 🎲 Random filename generator
const getRandom = (ext = '') => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

// 🔢 Human-readable large number formatter
const h2k = (num) => {
    const symbols = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const tier = Math.log10(Math.abs(num)) / 3 | 0;

    if (tier === 0) return num.toString();
    const suffix = symbols[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = (num / scale).toFixed(1);

    return scaled.replace(/\.0$/, '') + suffix;
};

// 🔗 URL validator
const isUrl = (url = '') => {
    return /https?:\/\/[^\s/$.?#].[^\s]*/gi.test(url);
};

// 🔁 JSON pretty print
const Json = (data) => {
    try {
        return JSON.stringify(data, null, 2);
    } catch (err) {
        return '{}';
    }
};

// ⏱️ Format runtime from seconds
const runtime = (seconds = 0) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [
        d ? `${d} day${d > 1 ? 's' : ''}` : '',
        h ? `${h} hour${h > 1 ? 's' : ''}` : '',
        m ? `${m} minute${m > 1 ? 's' : ''}` : '',
        s ? `${s} second${s > 1 ? 's' : ''}` : ''
    ].filter(Boolean).join(', ');
};

// 😴 Delay
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// 🌐 Fetch JSON via GET
const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                ...(options.headers || {})
            },
            ...options
        });
        return res.data;
    } catch (err) {
        console.error("❌ fetchJson Error:", err.message);
        return { error: 'Failed to fetch JSON.' };
    }
};

module.exports = {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
};
