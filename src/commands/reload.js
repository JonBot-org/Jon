const chalk = require("chalk");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("[Developer]: Reload command data")
    .addStringOption((option) =>
      option
        .setName("path")
        .setDescription("The path to reload")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the command")
        .setRequired(true),
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (interaction) => {
    const path = interaction.options.getString("path", true);
    const name = interaction.options.getString("name", true);
    const command = interaction.client.commands.get(name.toLowerCase());

    if (!command) {
      return interaction.reply({
        content: "Command not found",
        ephemeral: true,
      });
    }

    try {
      delete require.cache[require.resolve(`./${path}.js`)];
      const object = require(`./${path}.js`);
      interaction.client.commands.set(object.data.name, object);
      await interaction.reply({
        content: `**Reloaded: ${object.data.name}**`,
        ephemeral: true,
      });
    } catch (error) {
      interaction.reply({ content: `${error}`, ephemeral: true });
      console.log(chalk.red(`[COMMAND] ||`, error));
    }
  },
};
