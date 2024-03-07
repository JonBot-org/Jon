const guilds = require("../../../../../db/guilds");
const { EmbedBuilder } = require("discord.js");
const {
  set: { report },
} = require("../../../../../Strings/messages.json");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply();
  const { member, guild } = interaction;
  const data = await guilds.findOne({ id: guild.id });

  if (data && data.configurations.report.enabled) {
    data.configurations.report.enabled = false;
    data.configurations.report.channel = null;
    await data.save();
  }

  const CompleteEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setDescription(report["disable.success"])
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [CompleteEmbed] });
};
