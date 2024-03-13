import { SlashCommandBuilder, EmbedBuilder, codeBlock, PermissionFlagsBits } from "discord.js";
import { CommandOptions, handleSubcommands } from "../lib/index.m";

export const command: CommandOptions = {
  application: {
    enabled: true,
    data: new SlashCommandBuilder()
      .setName("set")
      .setDescription("Configure guild settings.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .setDMPermission(false)
      .addSubcommandGroup((input) => {
        return input
          .setName("greet")
          .setDescription("Configure guild greet settings.")
          .addSubcommand((command) => {
            return command
              .setName("status")
              .setDescription("Update or view the status of greet settings.");
          })
          .addSubcommand((command) => {
            return command
              .setName("embed")
              .setDescription("Configure the embed to send.")
              .addStringOption((option) => {
                return option
                  .setName("name")
                  .setDescription("The embed name. E.g: my_embed");
              });
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
      console.error(status.error);

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
