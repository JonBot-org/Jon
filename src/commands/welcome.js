const { SlashCommandBuilder, ChannelType } = require("discord.js");

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
        .setName("edit")
        .setDescription("Edit the message that gets sent when a member joins.")
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription(`The content to display, if any.`)
        )
        .addStringOption((option) => {
          return option
          .setName('description')
          .setDescription('The description of the embed, if any.')
        })
        .addStringOption((option) => {
          return option
          .setName('color')
          .setDescription('Edit the color of the embed, default is Random')
        })
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
