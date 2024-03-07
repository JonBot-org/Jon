const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { loadSubcommands } = require("../../lib/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Configure settings.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommandGroup((command) => {
      return command
        .setName("report")
        .setDescription("Configure the report module.")
        .addSubcommand((option) => {
          return option
            .setName("enable")
            .setDescription("Enable the report module.")
            .addChannelOption((channel) => {
              return channel
                .setName("channel")
                .setDescription("The channel to configure.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((option) => {
          return option
            .setName("disable")
            .setDescription("Disable the report module.");
        });
    })
    .addSubcommandGroup((command) => {
      return command
        .setName("greet")
        .setDescription("Configure the greet module.")
        .addSubcommand((option) => {
          return option
            .setName("enable")
            .setDescription("Enable the greet module.")
            .addChannelOption((channel) => {
              return channel
                .setName("channel")
                .setDescription("The channel to send greet messages.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText);
            });
        })
        .addSubcommand((option) => {
          return option
            .setName("edit")
            .setDescription("Edit the greet message.")
            .addStringOption((string) => {
              return string
                .setName("message")
                .setDescription("The content of the greet message.")
                .setMaxLength(1999);
            })
            .addStringOption((string) => {
              return string
                .setName("description")
                .setDescription("The description of the greet embed.")
                .setMaxLength(3999);
            })
            .addStringOption((string) => {
              return string
                .setName("title")
                .setDescription("The title of the greet embed.");
            })
            .addStringOption((string) => {
              return string
                .setName("author_name")
                .setDescription("The author name of the greet embed.");
            })
            .addStringOption((string) => {
              return string
                .setName("author_icon")
                .setDescription("The author icon of the greet embed.");
            })
            .addStringOption((string) => {
              return string
                .setName("color")
                .setDescription("The color to display on the greet embed.")
                .setMaxLength(18)
                .setMinLength(3);
            })
            .addBooleanOption((boolean) => {
              return boolean
                .setName("timestamp")
                .setDescription(
                  "Dp you want to use a timestamp on the greet embed.",
                );
            });
        })
        .addSubcommand((option) => {
          return option
            .setName("disable")
            .setDescription("Disable the greet module.");
        });
    })
    .addSubcommandGroup((command) => {
      return command
        .setName("leaves")
        .setDescription("Configure the leaves module.")
        .addSubcommand((option) => {
          return option
            .setName("enable")
            .setDescription("Enable the leaves module.")
            .addChannelOption((channel) => {
              return channel
                .setName("channel")
                .setDescription("The channel to send leave messages.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true);
            });
        })
        .addSubcommand((option) => {
          return option
            .setName("edit")
            .setDescription("Edit the leave message.")
            .addStringOption((string) => {
              return string
                .setName("message")
                .setDescription("The content of the leave message.")
                .setMaxLength(1999);
            })
            .addStringOption((string) => {
              return string
                .setName("description")
                .setDescription("The description of the leave embed.")
                .setMaxLength(3999);
            })
            .addStringOption((string) => {
              return string
                .setName("title")
                .setDescription("The title of the leave embed.");
            })
            .addStringOption((string) => {
              return string
                .setName("author_name")
                .setDescription("The author name of the leave embed.");
            })
            .addStringOption((string) => {
              return string
                .setName("author_icon")
                .setDescription("The author icon of the leave embed.");
            })
            .addStringOption((string) => {
              return string
                .setName("color")
                .setDescription("The color to display on the leave embed.")
                .setMaxLength(18);
            })
            .addBooleanOption((boolean) => {
              return boolean
                .setName("timestamp")
                .setDescription("The timstamp of the leave embed.");
            });
        })
        .addSubcommand((option) => {
          return option
            .setName("disable")
            .setDescription("Disable the leave module.");
        });
    })
    .addSubcommand((command) => {
      return command
        .setName("logging")
        .setDescription("Configure the logging settings.");
    }),
};

module.exports.execute = (interaction, client) => {
  loadSubcommands(interaction);
};
