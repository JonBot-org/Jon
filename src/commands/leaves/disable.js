const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { emojify } = require("../../utils");
/**
 *
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();

  const member = await interaction.guild.members.fetch(interaction.user.id);
  const data = await client.db.guilds.findOne({ Id: interaction.guildId });
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

  embed.setColor("DarkPurple");

  if (data && data.leaves.enabled) {
    data.leaves.enabled = false;
    data.leaves.channel = null;
    data.leaves.message = null;
    await data.save();
    return interaction.editReply({
      embeds: [
        embed.setDescription(`${emojify(true)} | **Disabled leaves module.**`),
      ],
    });
  } else {
    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `${emojify(false)} | **Leave module is already disabled**`,
        ),
      ],
    });
  }
};
