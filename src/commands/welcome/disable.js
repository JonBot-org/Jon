const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { emojify } = require("../../utils");
const { guilds } = require("../../mongo/index");

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const data = await guilds.findOne({ Id: interaction.guildId });
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    embed
      .setDescription(
        `${emojify(false)} | **You don't have enough permissions to use this command.**`,
      )
      .setColor("Red");
    return interaction.editReply({ embeds: [embed] });
  }

  if (data && data.welcome.enabled) {
    data.welcome.enabled = false;
    data.welcome.channel = null;
    data.welcome.message = null;
    await data.save();
    embed
      .setDescription(
        `${emojify(true)} | **Disabled welcome module in this server.**`,
      )
      .setColor("Green");
    return interaction.editReply({ embeds: [embed] });
  } else {
    embed
      .setDescription(
        `${emojify(false)} | **Welcome module is already disabled, use /welcome enable to enable.**`,
      )
      .setColor("Orange");
    return interaction.editReply({ embeds: [embed] });
  }
};
