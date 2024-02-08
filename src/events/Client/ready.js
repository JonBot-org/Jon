const { Client } = require("discord.js");
const chalk = require("chalk");

module.exports = {
  name: "ready",
  type: "client",
  /**
   * @param {Client} client
   */
  run: (client) => {
    console.log(chalk.green(`[BOT] || ${client.user.username}, is ready!`));
  },
};
