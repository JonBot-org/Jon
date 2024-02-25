const { Events } = require("discord.js");
const { prefix } = require("../../config.json");

module.exports.data = {
  name: Events.MessageCreate,
  once: false,
};

/**
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').Client} client
 */
module.exports.execute = (message, client) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  let command = client.commands.get(args.shift().toLowerCase());

  if (!command) return;

  command.execute(message, args, client);
};
