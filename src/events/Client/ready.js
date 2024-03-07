const { Events } = require("discord.js");
const logger = require("jon-lib").Logger;
const { red, greenBright, yellowBright, blueBright } = require("chalk");

module.exports.data = {
  name: Events.ClientReady,
  once: true,
};

/**
 * @param {import('discord.js').Client} client
 */
module.exports.execute = (client) => {
  logger.prototype.info(`${client.user.username} is ready!`);

  console.log(
    red("————————————————"),
    greenBright(" [INFORMATION] "),
    red("————————————————") + "\n",
    yellowBright("»»»"),
    blueBright("[guilds]:"),
    red(client.guilds.cache.size) + "\n",
    yellowBright("»»»"),
    blueBright("[members]:"),
    red(client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
  );
};
