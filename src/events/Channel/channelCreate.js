const { Events, EmbedBuilder } = require("discord.js");
const db = require("../../mongo/index");

module.exports = {
  name: Events.ChannelCreate,
  type: "client",
  /**
   * @param {import('discord.js').Channel} channel
   */
  run: async (channel) => {
    if (channel.partial) await channel.fetch();
    const data = await db.config.findOne({ Id: channel.guildId });

    const embed = new EmbedBuilder()
      .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
      .setDescription(`**${channel} (${channel.name}) channel was just created.**`)
      .setFooter({ text: `channelID: ${channel.id}` })
      .setColor("Orange")
      .setTimestamp();

    if (data && data.server_logs.enabled) {
      const event = await channel.guild.channels.fetch(
        data.server_logs.channel,
      );
      if (event) {
        event.send({ embeds: [embed] }).catch();
      }
    }
  },
};
