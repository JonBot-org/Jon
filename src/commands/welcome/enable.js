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
  const channel = interaction.options.getChannel("channel", true);
  const data = await guilds.findOne({ Id: interaction.guildId });
  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setTimestamp();

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    embed
      .setDescription(
        `${emojify(false)} | **You don't have permissions to use this command.**`,
      )
      .setColor("Red");
    return interaction.editReply({ embeds: [embed] });
  }

  embed
    .setDescription(
      `${emojify(true)} | **Enabled welcome module.**\n- **Channel:** ${channel}`,
    )
    .setColor("DarkPurple");

  if (!data) {
    await guilds.create({
      Id: interaction.guildId,
      welcome: {
        enabled: true,
        channel: channel.id,
      },
    });

    return interaction.editReply({ embeds: [embed] });
  }

  data.welcome.enabled = true;
  data.welcome.channel = channel.id;
  await data.save();
  return interaction.editReply({ embeds: [embed] });
};
