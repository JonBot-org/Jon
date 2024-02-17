module.exports = {
  name: "interactionCreate",
  type: "client",
  /**
   * @param {import("discord.js").Interaction} interaction
   */
  run: (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    if (command.devOnly && interaction.inGuild()) {
      if (!["1199385421243752578"].includes(interaction.guildId)) {
        return interaction.reply({
          content: `You can't use this command.`,
          ephemeral: true,
        });
      }
    }

    try {
      command.run(interaction);
    } catch (error) {
      console.error(error);
    }
  },
};
