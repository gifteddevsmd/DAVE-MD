const fs = require('fs');
const axios = require('axios');
const path = './config.env';
const FormData = require('form-data');

// ⬆️ Upload file and return Empire CDN URL
async function empiretourl(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const form = new FormData();
    const fileStream = fs.createReadStream(filePath);
    form.append('file', fileStream);
    form.append('originalFileName', filePath.split('/').pop());

    try {
        const response = await axios.post("https://cdn.empiretech.biz.id/api/upload.php", form, {
            headers: {
                ...form.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        if (response.data?.url) {
            return response.data.url;
        } else {
            throw new Error(`Unexpected response format: ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.error('❌ Error uploading to Empire:', error.message);
        if (error.response) {
            throw new Error(`Empire API Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
            throw new Error('Empire upload failed: ' + error.message);
        }
    }
}

// 📥 Get file buffer from URL
const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Requests': 1,
                ...(options.headers || {})
            },
            ...options
        });
        return res.data;
    } catch (e) {
        console.error('❌ getBuffer Error:', e.message);
        return null;
    }
};

// 👑 Get group admin IDs
const getGroupAdmins = (participants = []) =>
    participants.filter(p => p.admin !== null).map(p => p.id);

// 🎲 Generate random string with extension
const getRandom = (ext = '') => `${Math.floor(Math.random() * 10000)}${ext}`;

// 🔢 Format large numbers (e.g., 1.2K)
const h2k = (eco = 0) => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const tier = Math.floor(Math.log10(Math.abs(eco)) / 3);
    if (tier === 0) return eco.toString();
    const scale = Math.pow(10, tier * 3);
    return (eco / scale).toFixed(1).replace(/\.0$/, '') + suffixes[tier];
};

// 🔗 Test if input is a valid URL
const isUrl = (url = '') =>
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi.test(url);

// 📦 Convert JSON object to string
const Json = (input) => {
    try {
        return JSON.stringify(input, null, 2);
    } catch (err) {
        return '{}';
    }
};

// ⏱️ Format runtime from seconds
const runtime = (seconds = 0) => {
    seconds = Math.floor(seconds);
    const d = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const h = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return [
        d ? `${d}d` : '',
        h ? `${h}h` : '',
        m ? `${m}m` : '',
        `${s}s`
    ].filter(Boolean).join(' ');
};

// 😴 Delay utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🌐 Fetch JSON response from any URL
const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                ...(options.headers || {})
            },
            ...options
        });
        return res.data;
    } catch (err) {
        console.error('❌ fetchJson Error:', err.message);
        return null;
    }
};

// 💾 Save key-value into .env config file
const saveConfig = (key, value) => {
    let configData = fs.existsSync(path) ? fs.readFileSync(path, 'utf8').split('\n') : [];
    let updated = false;

    configData = configData.map(line => {
        if (line.startsWith(`${key}=`)) {
            updated = true;
            return `${key}=${value}`;
        }
        return line;
    });

    if (!updated) configData.push(`${key}=${value}`);
    fs.writeFileSync(path, configData.join('\n'), 'utf8');
    require('dotenv').config({ path }); // Reload env
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
    fetchJson,
    saveConfig,
    empiretourl
};
