const { cmd } = require("../command");
const { sleep } = require("../lib/functions");
const { exec } = require("child_process");

cmd(
  {
    pattern: "restart",
    desc: "*ʀᴇsᴛᴀʀᴛ 𝐃𝐀𝐕𝐄-𝐌𝐃*",
    category: "owner",
    filename: __filename
  },
  async (conn, mek, m, { reply, isCreator }) => {
    try {
      if (!isCreator) {
        return reply("Only the *owner* can restart the bot.");
      }

      reply("*🔄 Restarting 𝐃𝐀𝐕𝐄-𝐌𝐃...*");
      await sleep(1500);

      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
          console.error(`Restart Error: ${error}`);
          return reply(`❌ Restart failed:\n${error.message}`);
        }
        console.log(`PM2 Output:\n${stdout}`);
      });

    } catch (err) {
      console.error("Unhandled error in restart command:", err);
      reply(`❌ Error:\n${err.message}`);
    }
  }
);
