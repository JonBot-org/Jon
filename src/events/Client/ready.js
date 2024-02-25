const { Events } = require("discord.js");
const logger = require("jon-lib").Logger;

module.exports.data = {
  name: Events.ClientReady,
  once: true,
};

/**
 * @param {import('discord.js').Client} client
 */
module.exports.execute = (client) => {
  logger.prototype.info(`${client.user.username} is ready!`);
};
