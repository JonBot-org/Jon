const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  codeBlock,
} = require("discord.js");
const { versionFile } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("See recent updates made to the bot!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  run: (interaction) => {
    const version = require(`../../versions/${versionFile}`);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(
        `**Version:** ${version.version}\n**Release Date:** ${version.date}\n**Author:** ${version.author}\n**Commit:** [${version.data.commit}](https://github.com/JonBot-org/Jon/commit/${version.data.commit})\n\n**Changes:**\n${codeBlock(version.changes.map((e) => e).join("\n"))}`,
      )
      .setColor('Green')
      .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true })
  },
};
