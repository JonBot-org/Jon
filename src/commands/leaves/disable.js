const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { emojis } = require("../../utils");
/**
 *
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply();

  const member = await interaction.guild.members.fetch(interaction.user.id);
  const data = await client.db.guilds.findOne({ Id: interaction.guildId });

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `${emojis.utility.false.raw} | **You don't have enough permissions to use this command.**`,
      )
      .setColor("Red")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setColor("Green")
    .setTimestamp();

  if (data) {
    data.leaves.enabled = false;
    data.leaves.channel = null;
    data.leaves.message = null;
    await data.save();
    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `${emojis.utility.true.raw} | **Disabled leaves module.**`,
        ),
      ],
    });
  } else {
    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `${emojis.utility.false.raw} | **Leave module is already disabled**`,
        ),
      ],
    });
  }
};
