const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { emojis, replaceAllMember } = require("../../utils");

/**
 *
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const message = interaction.options.getString("message", true);
  const data = await client.db.guilds.findOne({ Id: interaction.guildId });

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `${emojis.false} | **You don't have enough permissions to use this command.**`,
      )
      .setColor("Red")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (data && data.leaves.enabled) {
    data.leaves.message = message;
    await data.save();
    embed
      .setDescription(
        `${emojis.true} | **Updated the leave message**`,
      )
      .addFields({
        name: "Preview:",
        value: `${replaceAllMember(message, interaction.member)}`,
      })
      .setColor("Green");
    return interaction.editReply({ embeds: [embed] });
  } else {
    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${emojis.false} | **Leave module is not emabled in this server. Use /leave enable**`,
          )
          .setColor("Orange"),
      ],
    });
  }
};
