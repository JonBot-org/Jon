const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
  ActionRow,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { Logger } = require("jon-lib");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from this server.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => {
      return option
        .setName("member")
        .setDescription("The member to kick.")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("The reason for kicking this member.");
    }),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */
  execute: async (interaction, client) => {
    const { options, user, guild } = interaction;

    const member = options.getMember("member", true);
    const reason = options.getString("reason") || "No Reason Provided";

    if (!member) {
      const MemberNotFoundEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`I coudn't find the member given.`)
        .setColor("LuminousVividPink")
        .setTimestamp();

      return interaction.reply({
        embeds: [MemberNotFoundEmbed],
        ephemeral: true,
      });
    }

    if ((!member) instanceof GuildMember) await member.fetch();

    if (!member.kickable) {
      const CantKickMember = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`I can't kick this member.`)
        .setColor("Orange")
        .setTimestamp();
    }

    try {
      await interaction.deferReply();

      const DMMessageEmbed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setDescription(
          `You were kicked from **${guild.name}**\n\n» **Reason:** ${reason}`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      const DMMessageComponent = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("/*//*-/-/")
          .setLabel(`${guild.name} | Kick`)
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
      );

      await member.kick(reason);

      if (!member.user.bot) {
        await member.user.send({
          embeds: [DMMessageEmbed],
          components: [DMMessageComponent],
        });
      }

      const CompleteEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`Kicked \`${member.user.username}\`\n`)
        .setColor("LuminousVividPink")
        .setTimestamp();

      return interaction.editReply({ embeds: [CompleteEmbed] });
    } catch (error) {
      Logger.prototype.error("kick-try.catch", error);

      if (error.message === "Missing Permissions") {
        const MissingPermissionToBanThisMemberEmbed = new EmbedBuilder()
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
          .setDescription(`I don't have permissions to kick this member.`)
          .setColor("Orange")
          .setTimestamp();

        return interaction.editReply({
          embeds: [MissingPermissionToBanThisMemberEmbed],
        });
      }
    }
  },
};
