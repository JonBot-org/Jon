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
        .setName("edit")
        .setDescription("Edit the message thats get sent.")
        .addStringOption((option) => {
          return option
            .setName("content")
            .setDescription("The content to display, if any.");
        })
        .addStringOption((option) => {
          return option
            .setName("description")
            .setDescription("The description of the embed, if any.");
        })
        .addStringOption((option) => {
          return option
            .setName("color")
            .setDescription("The color of the embed, default = Random");
        });
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
