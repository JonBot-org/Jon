const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  /**
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Client} client
   */
  execute: (message, args, client) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`My ping is **${client.ws.ping}ms**`)
      .setColor("Random")
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
