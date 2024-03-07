const {
  EmbedBuilder,
  GuildFeature,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageManager,
  GuildMember,
} = require("discord.js");
const utils = require("../../../../lib/time");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  const { options, user, guild } = interaction;

  const member = options.getMember("member", true);
  let history = options.getString("history") || "7d";
  const reason = options.getString("reason") || "No Reason Given.";

  if (!member) {
    const MemberNotFoundEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`I coudn't find the given member in this server.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.reply({
      embeds: [MemberNotFoundEmbed],
      ephemeral: true,
    });
  }

  if ((!member) instanceof GuildMember) await member.fetch().catch();

  try {
    if (utils.convertTimeString(history) > 604800000) history = "7d";

    await interaction.deferReply();
    const CantBanThisMemberEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`I can't ban this member.`)
      .setColor("Orange")
      .setTimestamp();

    if (!member.bannable) {
      return interaction.editReply({ embeds: [CantBanThisMemberEmbed] });
    }

    const DMMemberBeforeBanEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setDescription(
        `» You were banned in **${guild.name}**\n\n» **Reason:** ${reason}\n» **At:** <t:${(new Date().getTime() / 1000).toFixed(0)}>\n» **Joined Server At:** <t:${(new Date(member.joinedAt).getTime() / 1000).toFixed(0)}>`,
      )
      .setColor("Red")
      .setTimestamp();

    const DisabledButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(guild.id)
        .setLabel(`${guild.name} | Ban`)
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true),
    );

    if (!member.user.bot) {
      await member.user
        .send({
          embeds: [DMMemberBeforeBanEmbed],
          components: [DisabledButton],
        })
        .catch();
    }

    await member.ban({
      reason: reason,
      deleteMessageSeconds: (
        (utils.convertTimeString(history) % 60000) /
        1000
      ).toFixed(0),
    });

    const CompletedEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(
        `» Banned \`${member.user.username}\`\n   » **Target:** ${member.user}\n   » **Reason:** ${reason}\n   » **Moderator:** ${user}`,
      )
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [CompletedEmbed] });
  } catch (error) {
    if (error.message === "Invalid time string") {
      const ErrorInvalidTimeEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(
          `Invalid time format given: ${history}\n\n » **E.g:** 6d10h30m`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      return interaction.editReply({ embeds: [ErrorInvalidTimeEmbed] });
    }
  }
};
