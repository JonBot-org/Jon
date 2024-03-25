const { ChatInputCommandInteraction } = require("discord.js");

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = (interaction) => {
  const { client } = interaction;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (interaction.options.getSubcommand()) {
    require(
      `../../sub-commands/${interaction.commandName}/${interaction.options.getSubcommand()}.js`,
    )(interaction);
  } else {
    command.run(interaction);
  }
};
