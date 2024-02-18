const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure the bot settings.")
    .setDMPermission(false)
    .addSubcommandGroup((command) => {
      return command
        .setName("moderation")
        .setDescription("Configure the moderation settings of this guild.")
        .addSubcommand((option) => {
          return option
            .setName("logs")
            .setDescription("Log moderation actions.")
            .addChannelOption((option) => {
              return option
                .setName("channel")
                .setDescription("The channel to send moderation actions to.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true);
            })
            .addBooleanOption((option) => {
              return option
                .setName("enabled")
                .setDescription("Do you want to enable this module?")
                .setRequired(true);
            });
        });
    })
    .addSubcommandGroup((command) => {
      return command
        .setName("events")
        .setDescription("Configure the event settings for this guild.")
        .addSubcommand((option) => {
          return option
            .setName("server")
            .setDescription("Recive & log server updates to a channel.")
            .addChannelOption((option) => {
              return option
                .setName("channel")
                .setDescription("The channel to log these events to.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true);
            })
            .addBooleanOption((option) => {
              return option
                .setName("enabled")
                .setDescription("Do you want to enable this event?")
                .setRequired(true);
            });
        });
    }),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */ run: (interaction) => {
    if (interaction.options.getSubcommandGroup()) {
      require(
        `./config/${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}.js`,
      )(interaction);
    } else {
      require(`./config/${interaction.options.getSubcommand()}.js`)(
        interaction,
      );
    }
  },
};
