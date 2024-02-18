const { Events, EmbedBuilder } = require("discord.js");
const db = require("../../mongo/index");

module.exports = {
  name: Events.ChannelUpdate,
  type: "client",
  /**
   * @param {import('discord.js').Channel} channel
   * @param {import('discord.js').Channel} oldChannel
   */
  run: async (oldChannel, channel) => {
    const data = await db.config.findOne({ Id: channel.guildId });
    if (data && !data.server_logs.enabled) return;
    const event = await channel.guild.channels.fetch(data.server_logs.channel);
    if (!event) return;
    const embed = new EmbedBuilder()
      .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
      .setFooter({ text: `channelID: ${channel.id}` })
      .setColor("DarkPurple")
      .setTimestamp();

    if (oldChannel.name !== channel.name) {
      sendEvent(
        {
          embeds: [
            embed.setDescription(
              `**${channel} (${channel.id}) name was updated.**\n\n- **Old:** ${oldChannel.name}\n- **New:** ${channel.name}`,
            ),
          ],
        },
        event,
      );
    }

    if (oldChannel.topic !== channel.topic) {
      sendEvent(
        {
          embeds: [
            embed.setDescription(
              `**${channel} (${channel.id}) topic was updated.**\n\n- **Old:** ${oldChannel.topic ? oldChannel.topic : "**None**"}\n- **New:** ${channel.topic ? channel.topic : "**None**"}`,
            ),
          ],
        },
        event,
      );
    }
  },
};

/**
 * @param {import('discord.js').Channel} channel
 * @param {import('discord.js').MessageCreateOptions}
 */
function sendEvent(data, channel) {
  channel.send(data);
}
