const {
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Setup the welcome system in this server!")
    .setDMPermission(false)
    .addSubcommand((command) => {
      return command
        .setName("enable")
        .setDescription("Enable the welcome module.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the welcome messages to.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText),
        );
    })
    .addSubcommand((command) => {
      return command
        .setName("disable")
        .setDescription("Disable the welcome module.");
    })
    .addSubcommand((command) => {
      return command
        .setName("message")
        .setDescription("Edit the message that gets sent")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              `The message to display on the embed, "0" = default`,
            )
            .setRequired(true),
        );
    }),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  run: (interaction) => {
    require(`./welcome/${interaction.options.getSubcommand()}.js`)(
      interaction.client,
      interaction,
    );
  },
};
