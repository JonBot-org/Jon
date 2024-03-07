const { EmbedBuilder } = require("discord.js");
const guilds = require("../../../../../db/guilds");
const { emojis } = require('../../../../../lib/functions');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  await interaction.deferReply();
  const { guild, user } = interaction;
  const data = await guilds.findOne({ id: guild.id });

  if (data && data.configurations.greet.enabled) {
    data.configurations.greet.enabled = false;
    data.configurations.greet.channel = null;
    await data.save();
  }

  const completeEmbed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(`${emojis.success} | Disabled greet module.`)
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [completeEmbed] });
};
