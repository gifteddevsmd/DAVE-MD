const config = require('../settings');
const { cmd } = require('../command');

// Compatibility Command
cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calculate the compatibility score between two users.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 2 || m.mentionedJid.length < 2) {
      return reply("Please tag two users.\nUsage: `.compatibility @user1 @user2`");
    }
    let [user1, user2] = m.mentionedJid;
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;
    let score = Math.floor(Math.random() * 1000) + 1;

    if ([user1, user2].includes(specialNumber)) score = 1000;

    let result = `💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: *${score}/1000* 💖`;
    await conn.sendMessage(mek.chat, { text: result, mentions: [user1, user2] }, { quoted: mek });
  } catch (e) {
    reply("❌ " + e.message);
  }
});

// Aura Command
cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag"
}, async (conn, mek, m, { args, reply }) => {
  try {
    let user = m.mentionedJid[0];
    if (!user) return reply("Tag someone!\nUsage: `.aura @user`");

    const special = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;
    let score = (user === special) ? 999999 : Math.floor(Math.random() * 1000) + 1;

    let result = `💀 Aura of @${user.split("@")[0]}: *${score}*/1000 🗿`;
    await conn.sendMessage(mek.chat, { text: result, mentions: [user] }, { quoted: mek });
  } catch (e) {
    reply("❌ " + e.message);
  }
});

// Roast Command
cmd({
  pattern: "roast",
  desc: "Roast someone",
  category: "fun",
  react: "🔥",
  filename: __filename,
  use: "@tag"
}, async (conn, mek, m, { reply }) => {
  const roasts = [
    "Bro, your IQ is lower than a weak WiFi signal!",
    "Your thoughts are like a WhatsApp status — disappear in 24 hours!",
    "You’re a VIP — Very Idiotic Person!",
    "Google can’t even find your logic.",
    "You’re like a system error — always crashing!",
    "Even your own shadow left you.",
    "You're the reason WiFi says 'connected but no internet'.",
    "Your presence is like lag in a game — annoying!"
  ];
  let user = m.mentionedJid[0];
  if (!user) return reply("Tag someone to roast them. Example: `.roast @user`");

  let line = roasts[Math.floor(Math.random() * roasts.length)];
  let message = `🔥 @${user.split("@")[0]}:\n*${line}*\n> Just fun, don’t take it seriously!`;

  await conn.sendMessage(mek.chat, { text: message, mentions: [user] }, { quoted: mek });
});

// 8Ball Command
cmd({
  pattern: "8ball",
  desc: "Ask a yes/no question",
  category: "fun",
  react: "🎱",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("Ask something! Example: `.8ball Will I win tomorrow?`");

  const answers = [
    "Yes!", "No.", "Maybe.", "Definitely!", "Ask later.",
    "I don't think so.", "Absolutely!", "Looks promising!", "No way!"
  ];
  reply(`🎱 *Magic 8-Ball says:* ${answers[Math.floor(Math.random() * answers.length)]}`);
});

// Compliment Command
cmd({
  pattern: "compliment",
  desc: "Give a nice compliment",
  category: "fun",
  react: "😊",
  filename: __filename,
  use: "@tag (optional)"
}, async (conn, mek, m, { reply }) => {
  const compliments = [
    "You're amazing just the way you are! 💖",
    "You light up every room you walk into! 🌟",
    "Your smile is contagious! 😊",
    "You're stronger than you think! 💪",
    "You're a walking masterpiece of awesomeness! 🎨"
  ];

  let target = m.mentionedJid[0];
  let compliment = compliments[Math.floor(Math.random() * compliments.length)];
  let sender = `@${mek.sender.split("@")[0]}`;

  let msg = target
    ? `${sender} complimented @${target.split("@")[0]}:\n*${compliment}*`
    : `${sender}, you forgot to tag someone. Here's one for you:\n*${compliment}*`;

  await conn.sendMessage(mek.chat, { text: msg, mentions: [mek.sender, target].filter(Boolean) }, { quoted: mek });
});

// LoveTest Command
cmd({
  pattern: "lovetest",
  desc: "Check love compatibility between two users",
  category: "fun",
  react: "❤️",
  filename: __filename,
  use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
  if (args.length < 2 || m.mentionedJid.length < 2) {
    return reply("Tag two users. Example: `.lovetest @user1 @user2`");
  }

  let [user1, user2] = m.mentionedJid;
  let lovePercent = Math.floor(Math.random() * 100) + 1;
  let messages = [
    { range: [90, 100], text: "💖 *A match made in heaven!*" },
    { range: [75, 89], text: "😍 *Strong connection!*" },
    { range: [50, 74], text: "😊 *Good compatibility!*" },
    { range: [30, 49], text: "🤔 *It’s complicated!*" },
    { range: [10, 29], text: "😅 *Not the best match.*" },
    { range: [1, 9], text: "💔 *Uh-oh! Love failed!*" }
  ];

  let selected = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]);

  let msg = `💘 *Love Test*\n❤️ @${user1.split("@")[0]} + @${user2.split("@")[0]} = *${lovePercent}%*\n${selected.text}`;
  await conn.sendMessage(mek.chat, { text: msg, mentions: [user1, user2] }, { quoted: mek });
});

// Emoji Converter Command
cmd({
  pattern: "emoji",
  desc: "Convert text into emoji form.",
  category: "fun",
  react: "🙂",
  filename: __filename,
  use: "<text>"
}, async (conn, mek, m, { args, reply }) => {
  let text = args.join(" ");
  if (!text) return reply("Type something! Example: `.emoji hello`");

  const emojiMap = {
    "a": "🅰️", "b": "🅱️", "c": "🇨️", "d": "🇩️", "e": "🇪️", "f": "🇫️", "g": "🇬️",
    "h": "🇭️", "i": "🇮️", "j": "🇯️", "k": "🇰️", "l": "🇱️", "m": "🇲️", "n": "🇳️",
    "o": "🅾️", "p": "🇵️", "q": "🇶️", "r": "🇷️", "s": "🇸️", "t": "🇹️", "u": "🇺️",
    "v": "🇻️", "w": "🇼️", "x": "🇽️", "y": "🇾️", "z": "🇿️",
    "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣",
    "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣",
    " ": "⬜"
  };

  let result = text.toLowerCase().split("").map(c => emojiMap[c] || c).join("");
  await conn.sendMessage(mek.chat, { text: result }, { quoted: mek });
});
