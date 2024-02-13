const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping, pong!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  run: (interaction) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji({ id: "1201458525243711489" })
        .setLabel("Github")
        .setURL("https://github.com/JonBot-org/Jon"),
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `<:u_n_s:1205129118925070398> | **Ping:** \`${interaction.client.ws.ping}ms\``,
      )
      .setColor("DarkVividPink")
      .setTimestamp();

    let response = { embeds: [embed] };
    if (Math.floor(Math.random() * 4) === 2)
      response = { embeds: [embed], row: [row] };

    return interaction.reply(response);
  },
};
