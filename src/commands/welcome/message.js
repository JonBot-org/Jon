const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { emojis, replaceAllMember } = require("../../utils");
const { guilds } = require("../../mongo/index");

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();
  const member = await interaction.guild.members.fetch(interaction.user.id);
  let message = interaction.options.getString("message", true);
  if (message === "0") message = "**Welcome to {guild.name}, {member}!**";
  const data = await guilds.findOne({ Id: interaction.guildId });

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

  if (data && data.welcome.enabled) {
    data.welcome.message = message;
    await data.save();
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(`${emojis.true} | **Updated the message.**`)
      .addFields({
        name: "Preview:",
        value: `${replaceAllMember(message, interaction.member)}`,
      })
      .setColor("Green")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  } else {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `${emojis.false} | **This server does not have welcome module enabled, use /welcome enable**`,
      )
      .setColor("Orange")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  }
};
