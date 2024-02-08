const chalk = require("chalk");

module.exports = {
  name: "interactionCreate",
  type: "client",
  /**
   * @param {import("discord.js").Interaction} interaction
   */
  run: (interaction) => {
    if (interaction.isChatInputCommand()) {
      console.log(
        chalk.yellow(
          `[COMMAND] || Finding command : ${interaction.commandName}`,
        ),
      );

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

      console.log(
        chalk.green(`[COMMAND] || Executing ${command.data.name}...`),
      );
      command.run(interaction);
    }
  },
};
