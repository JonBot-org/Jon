const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("See how long i have been up for!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  run: (interaction) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**Uptime:** ${uptimeString(interaction.client)}`)
      .setColor("DarkPurple")
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};

function uptimeString(client) {
  let totalseconds = client.uptime / 1000;
  let days = Math.floor(totalseconds / 86400);
  totalseconds %= 86400;
  let hours = Math.floor(totalseconds / 3600);
  totalseconds %= 3600;
  let minutes = Math.floor(totalseconds / 60);
  let seconds = Math.floor(totalseconds % 60);
  return `${days} Days, ${hours} Hours, ${minutes} Minutes, and ${seconds} seconds`;
}
