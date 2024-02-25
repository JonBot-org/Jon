const { Events, EmbedBuilder } = require("discord.js");
const logging = require("../../db/logging");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,
};

/**
 * @param {import('discord.js').Interaction} interaction
 */
module.exports.execute = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "logging-channel.disable") {
    await interaction.deferUpdate();
    const data = await logging.findOne({ id: interaction.guildId });

    if (data && data.channel_config.enabled) {
      data.channel_config.enabled = false;
      data.channel_config.cid = null;
      await data.save();
    }

    const completeEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`Disabled channel event logging.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [completeEmbed], components: [] });
  } else if (interaction.customId === 'logging-message.disable') {
    await interaction.deferUpdate();
    const data = await logging.findOne({ id: interaction.guildId });

    if (data && data.message_config.enabled) {
        data.message_config.enabled = false;
        data.message_config.cid = null;
        await data.save();
    }

    const completeEmbed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setDescription(`Disabled message event logging.`)
    .setColor('LuminousVividPink')
    .setTimestamp();

    return interaction.editReply({ embeds: [completeEmbed], components: [] });
  }
};
