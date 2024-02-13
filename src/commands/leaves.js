const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Setup the leave system in the server!")
    .addSubcommand((command) => {
      return command
        .setName("enable")
        .setDescription("Enable the leave module.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the leave message")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        );
    })
    .addSubcommand((command) => {
      return command
        .setName("disable")
        .setDescription("Disable the leave module.");
    })
    .addSubcommand((comamnd) => {
      return comamnd
        .setName("message")
        .setDescription("Edit the message that gets sent when a member leaves.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Enter the message to send when a member leaves.")
            .setRequired(true),
        );
    }),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  run: (interaction) => {
    require(`./leaves/${interaction.options.getSubcommand()}.js`)(
      interaction.client,
      interaction,
    );
  },
};
