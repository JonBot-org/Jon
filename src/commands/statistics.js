const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  codeBlock,
} = require("discord.js");
const os = require("node:os");
const { version, dependencies } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("statistics")
    .setDescription("Show statistics about the bot"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (interaction) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("collector.system-information")
        .setLabel("System Information")
        .setStyle(ButtonStyle.Primary),
    );

    const members = interaction.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
    );
    const channels = interaction.client.channels.cache.size;
    const servers = interaction.client.guilds.cache.size;
    const ping = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `> **Statistics**\nPing: ${ping}\nServers: ${servers}\nMembers: ${members}\nChannels: ${channels}`,
      )
      .setColor("Green")
      .setTimestamp();

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (i) => {
      if (!i.customId === "collector.system-information") return;

      let newInformation =
        (embed.data.description += `\n\n> **System Information**\nVersion: ${version}\nLibrary:\n${codeBlock(`@discordjs/${dependencies["discord.js"]}\n@chalk/${dependencies["chalk"]}`)}`);

      const newEmbed = new EmbedBuilder()
        .setAuthor({
          name: embed.data.author.name,
          iconURL: embed.data.author.icon_url,
        })
        .setDescription(`${newInformation}`)
        .setColor("Random")
        .setTimestamp();

      i.update({ embeds: [newEmbed], components: [] });
    });
  },
};
