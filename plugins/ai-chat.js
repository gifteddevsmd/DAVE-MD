const axios = require('axios');

module.exports = [
  {
    name: "ai",
    alias: ["bot", "dj", "gpt", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "ai",
    react: "🤖",
    async run({ conn, m, text, prefix, command }) {
      try {
        if (!text) return m.reply("Please provide a message for the AI.\nExample: .ai Hello");

        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
          return m.reply("AI failed to respond. Please try again later.");
        }

        await m.reply(`🤖 *AI Response:*\n\n${data.message}`);
      } catch (e) {
        console.error("Error in AI command:", e);
        m.reply("❌ An error occurred while communicating with the AI.");
      }
    }
  },

  {
    name: "openai",
    alias: ["chatgpt", "gpt3", "open-gpt"],
    desc: "Chat with OpenAI",
    category: "ai",
    react: "🧠",
    async run({ conn, m, text, prefix, command }) {
      try {
        if (!text) return m.reply("Please provide a message for OpenAI.\nExample: .openai Hello");

        const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result) {
          return m.reply("OpenAI failed to respond. Please try again later.");
        }

        await m.reply(`🧠 *OpenAI Response:*\n\n${data.result}`);
      } catch (e) {
        console.error("Error in OpenAI command:", e);
        m.reply("❌ An error occurred while communicating with OpenAI.");
      }
    }
  },

  {
    name: "deepseek",
    alias: ["deep", "seekai"],
    desc: "Chat with DeepSeek AI",
    category: "ai",
    react: "🧠",
    async run({ conn, m, text, prefix, command }) {
      try {
        if (!text) return m.reply("Please provide a message for DeepSeek AI.\nExample: .deepseek Hello");

        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) {
          return m.reply("DeepSeek AI failed to respond. Please try again later.");
        }

        await m.reply(`🧠 *DeepSeek AI Response:*\n\n${data.answer}`);
      } catch (e) {
        console.error("Error in DeepSeek AI command:", e);
        m.reply("❌ An error occurred while communicating with DeepSeek AI.");
      }
    }
  }
];
