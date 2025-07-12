const config = require('../config');
const { cmd } = require('../command');

let autoRecording = {
  status: false,   // default OFF
  scope: 'all'     // all | group | private
};

// Presence trigger (runs on every message)
cmd({ on: 'body' }, async (conn, mek, m, { from, isGroup }) => {
  try {
    if (!autoRecording.status) return;

    const applyTo = autoRecording.scope;

    if (
      applyTo === 'all' ||
      (applyTo === 'group' && isGroup) ||
      (applyTo === 'private' && !isGroup)
    ) {
      await conn.sendPresenceUpdate('recording', from);
    }
  } catch (err) {
    console.error("Auto-recording presence error:", err);
  }
});

// Command to control recording behavior
cmd({
  pattern: "autorecord",
  alias: ["autorec", "autord"],
  desc: "Turn ON/OFF auto-recording in group/private/all chats",
  category: "settings",
  filename: __filename
}, async (conn, mek, m, { q, reply, isCreator }) => {
  if (!isCreator) return reply("⚠️ *Only owner can use this command.*");

  const args = q.trim().split(/\s+/);
  const action = args[0]?.toLowerCase();
  const scope = args[1]?.toLowerCase();

  if (["on", "off"].includes(action)) {
    autoRecording.status = action === "on";

    if (["all", "group", "private"].includes(scope)) {
      autoRecording.scope = scope;
    }

    return reply(`✅ *Auto-recording is now ${autoRecording.status ? "enabled" : "disabled"}* for *${autoRecording.scope}* chats.`);
  }

  return reply(`❓ *Usage:* 
\`\`\`
.autorecord on [all|group|private]
.autorecord off
\`\`\`
Example: 
.autorecord on group`);
});