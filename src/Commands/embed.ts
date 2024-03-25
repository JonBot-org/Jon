import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  codeBlock,
} from "discord.js";
import { CommandOptions, Logger, handleSubcommands } from "../lib/index.m";

export const command: CommandOptions = {
  application: {
    enabled: true,
    data: new SlashCommandBuilder()
      .setName("embed")
      .setDescription("Configure embeds.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .setDMPermission(false)
      .addSubcommand((input) => {
        return input
          .setName("create")
          .setDescription("Create a embed.")
          .addStringOption((option) => {
            return option
              .setName("name")
              .setDescription("The embed name.")
              .setRequired(true);
          });
      })
      .addSubcommand((input) => {
        return input
          .setName("edit")
          .setDescription("Edit a embed.")
          .addStringOption((option) => {
            return option
              .setName("name")
              .setDescription("The name of the embed you want to edit.")
              .setRequired(true);
          });
      })
      .addSubcommand((input) => {
        return input
          .setName("display")
          .setDescription("Display all the embeds that belong to this guild.")
          .addStringOption((option) => {
            return option
              .setName("name")
              .setDescription("Input embef name if you want to get that embed");
          });
      }),
  },

  message: {
    enabled: false,
  },

  async chatInputRun(interaction) {
    await interaction.deferReply();

    const status = await handleSubcommands(interaction);

    if (!status.success) {
      Logger.prototype.error(status.error, 1);

      const ErrorEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`\`Internal Error\`\n${codeBlock(`${status.error}`)}`)
        .setColor("Red")
        .setTimestamp();

      return interaction.editReply({ embeds: [ErrorEmbed] });
    }
  },
};
