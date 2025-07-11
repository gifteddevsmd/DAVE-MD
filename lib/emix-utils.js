const axios = require("axios");

/**
 * Fetch Emoji Mix image from API.
 * @param {string} emoji1 - First emoji.
 * @param {string} emoji2 - Second emoji.
 * @returns {Promise<string>} - The image URL.
 */
async function fetchEmix(emoji1, emoji2) {
    try {
        if (!emoji1 || !emoji2) {
            throw new Error("Invalid emoji input. Please provide two emojis.");
        }

        const apiUrl = `https://levanter.onrender.com/emix?q=${encodeURIComponent(emoji1)},${encodeURIComponent(emoji2)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.result) {
            return response.data.result; // ✅ Main result
        } else {
            throw new Error("No valid image found in API response.");
        }
    } catch (error) {
        console.error("🛑 fetchEmix Error:", error.message);

        // 🔁 Fallback (you can customize this):
        return "https://i.ibb.co/rZ2XK0T/emix-fallback.png"; // placeholder fallback emoji mix image
    }
}

module.exports = { fetchEmix };
