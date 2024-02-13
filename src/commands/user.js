const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("User related commands")
    .setDMPermission(false)
    .addSubcommand((command) => {
      return command
        .setName("whois")
        .setDescription("Get information on a specific user.")
        .addUserOption((option) => {
          return option
            .setName("target")
            .setDescription("The user to get information on.")
            .setRequired(true);
        });
    }),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction}
   */
  run: async (interaction) => {
    require(`./user/${interaction.options.getSubcommand()}.js`)(
      interaction.client,
      interaction,
    );
  },
};
