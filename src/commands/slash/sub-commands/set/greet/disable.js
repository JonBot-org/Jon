const { EmbedBuilder } = require("discord.js");
const guilds = require("../../../../../db/guilds");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply();
  const { guild, member } = interaction;

  const data = await guilds.findOne({ id: guild.id });

  if (!data || !data.configurations.greet.enabled) {
    const NoConfigs = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(
        `The greet module is already disabled. To enabled use </set greet enable:1209442876090617856>`,
      )
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [NoConfigs] });
  }

  data.configurations.greet.enabled = false;
  data.configurations.greet.channel = null;
  await data.save();

  const completeEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setDescription(`Disabled greet module.`)
    .setColor("LuminousVividPink")
    .setTimestamp();

  return interaction.editReply({ embeds: [completeEmbed] });
};
