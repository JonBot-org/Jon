const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "help",
  category: "bot",
  description: "",
  /**
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Client} client
   */
  execute: async (message, args, client) => {
    const { author } = message;

    const commands = client.commands
      .map((value) => `\`${value.name}\``)
      .join(", ");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Support")
        .setURL("https://discord.gg/g6ffuXBDSa"),
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
      .setDescription(
        `**Message Commands**\n- If you want to view information on application commands (/) use </about:>\n\n${commands}`,
      )
      .setColor("LuminousVividPink")
      .setTimestamp();

    return message.reply({ embeds: [embed], components: [row] });
  },
};
