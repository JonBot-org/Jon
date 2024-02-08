const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  type: "client",
  /**
   * @param {Client} client
   */
  run: (client) => {
    console.log(`[BOT] || ${client.user.username}, is ready!`);
  },
};
