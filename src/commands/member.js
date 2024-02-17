const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("member")
    .setDescription("Member related commands")
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
    })
    .addSubcommand((command) => {
      return command
        .setName("ban")
        .setDescription("Ban a member from this guild.")
        .addUserOption((option) => {
          return option
            .setName("member")
            .setDescription("The member to ban.")
            .setRequired(true);
        })
        .addNumberOption((option) => {
          return option
            .setName("delete")
            .setDescription("Delete message history.")
            .addChoices(
              {
                name: "Don't Delete Any",
                value: 0,
              },
              {
                name: "Previous Hour",
                value: 3600,
              },
              {
                name: "Previous 6 Hours",
                value: 21600,
              },
              {
                name: "Previous 12 Hours",
                value: 43200,
              },
              {
                name: "Previous 24 Hours",
                value: 86400,
              },
              {
                name: "Previous 3 Days",
                value: 259200,
              },
              {
                name: "Previous 7 Days",
                value: 604800,
              },
            );
        })
        .addStringOption((option) => {
          return option
            .setName("reason")
            .setDescription("The reason for banning this member?");
        });
    })
    .addSubcommand((command) => {
      return command
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption((option) => {
          return option
            .setName("user")
            .setDescription("The ID of the user to unban")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("reason")
            .setDescription("The resson for unbanning this member");
        });
    })
    .addSubcommand((command) => {
      return command
        .setName("mute")
        .setDescription("Mute a member from this guild.")
        .addUserOption((option) => {
          return option
            .setName("member")
            .setDescription("The member to mute.")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("duration")
            .setDescription("How long do you want to mute this member for?");
        })
        .addStringOption((option) => {
          return option
            .setName("reason")
            .setDescription("The reason for mute-ing this member?");
        });
    }),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction}
   */
  run: async (interaction) => {
    require(`./member/${interaction.options.getSubcommand()}.js`)(
      interaction.client,
      interaction,
    );
  },
};
