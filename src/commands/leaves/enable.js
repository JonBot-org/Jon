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
  const channel = interaction.options.getChannel("channel", true);
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const data = await client.db.guilds.findOne({ Id: interaction.guildId });
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    embed
      .setDescription(
        `${emojify(false)} | **You don't have enough permissions to use this command**`,
      )
      .setColor("Red");
    return interaction.editReply({ embeds: [embed] });
  }

  embed
    .setDescription(
      `${emojify(true)} | **Enabled leaves module**\n- **Channel: ${channel}**`,
    )
    .setColor("DarkPurple");

  if (!data) {
    await client.db.guilds.create({
      Id: interaction.guildId,
      leaves: {
        enabled: true,
        channel: channel.id,
      },
    });
    return interaction.editReply({ embeds: [embed] });
  }

  data.leaves.enabled = true;
  data.leaves.channel = channel.id;
  await data.save();

  return interaction.editReply({ embeds: [embed] });
};
