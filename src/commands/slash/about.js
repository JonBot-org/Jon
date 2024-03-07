const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Information on the bot."),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */
  execute: async (interaction, client) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `Information on commands, modules & the bot.\n\n» **Ping:** ${client.ws.ping}ms\n» **Servers:** ${client.guilds.cache.size}\n» **Members:** ${client.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)}`,
      )
      .setColor("LuminousVividPink")
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ab.commands")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Commands"),
      new ButtonBuilder()
        .setCustomId("ab.modules")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Modules"),
    );

    return interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
