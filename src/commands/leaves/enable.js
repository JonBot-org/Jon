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
  const channel = interaction.options.getChannel("channel", true);
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const data = await client.db.guilds.findOne({ Id: interaction.guildId });

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `${emojis.utility.false.raw} | **You don't have enough permissions to use this command**`,
      )
      .setColor("Red")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setDescription(
      `${emojis.utility.true.raw} | **Enabled leaves module, i will send a message in ${channel} when a member leaves.**`,
    )
    .setColor("Green")
    .setTimestamp();

  if (data) {
    data.leaves.enabled = true;
    data.leaves.channel = channel.id;
    await data.save();
  } else {
    data.create({
      Id: interaction.guildId,
      leaves: {
        enabled: true,
        channel: channel.id,
      },
    });
  }

  return interaction.editReply({ embeds: [embed] });
};
