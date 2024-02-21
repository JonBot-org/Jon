const { Events } = require("discord.js");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,
};

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports.execute = (interaction, client) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.applicationCommands.get(interaction.commandName);

  if (!command) return;

  command.execute(interaction, client);
};
