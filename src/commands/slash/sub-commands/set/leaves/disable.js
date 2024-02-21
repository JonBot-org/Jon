const { EmbedBuilder } = require("discord.js");
const guilds = require("../../../../../db/guilds");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply();
  const { guild, user } = interaction;

  const data = await guilds.findOne({ id: guild.id });

  if (data && data.configurations.leave.enabled) {
    data.configurations.leave.enabled = false;
    data.configurations.leave.channel = null;
    await data.save();

    const completeEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`Disabled leave module.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [completeEmbed] });
  } else {
    const NoConfig = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(`The leave module is already disabled. To enable use </set leave enable:1209442876090617856>`)
    .setColor('LuminousVividPink')
    .setTimestamp()

    return interaction.editReply({ embeds: [NoConfig] });
  }
};
