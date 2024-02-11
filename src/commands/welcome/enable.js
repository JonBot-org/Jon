const {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { emojis } = require("../../utils");
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

  if (member && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(
        `${emojis.false} | **You don't have permissions to use this command.**`,
      )
      .setColor("Red")
      .setTimestamp();
    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
    .setDescription(
      `${emojis.true} | **Enabled welcome module, i will now send a message in ${channel} when a member joins/leaves the server!**`,
    )
    .setColor("Green")
    .setTimestamp();

  if (data) {
    data.welcome.enabled = true;
    data.welcome.channel = channel.id;
    await data.save();
    return interaction.editReply({ embeds: [embed] });
  } else {
    await guilds.create({
      Id: interaction.guildId,
      welcome: {
        enabled: true,
        channel: channel.id,
      },
    });
    return interaction.editReply({ embeds: [embed] });
  }
};
