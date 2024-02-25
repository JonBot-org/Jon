const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const { convertNumberToType } = require("../../lib/functions");
const logging = require("../../db/logging");

module.exports.data = {
  name: Events.ChannelDelete,
  once: false,
};

/**
 * @param {import('discord.js').GuildBasedChannel} channel
 */
module.exports.execute = async (channel) => {
  const data = await logging.findOne({ id: channel.guildId });
  if (!data) return;

  const iconURL = channel.guild.iconURL()
    ? channel.guild.iconURL()
    : "https://discord.com/embed/avatars/0.png";
  if (channel.partial) return;

  const audit = (
    await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
      limit: 1,
    })
  ).entries.first();

  const embed = new EmbedBuilder()
    .setAuthor({ name: channel.guild.name, iconURL })
    .setDescription(
      `**Channel Deleted**\n» **Executor:** <@${audit.executorId}>\n» **Name:** #${channel.name}\n» **Type:** ${convertNumberToType(channel.type)}`,
    )
    .setFooter({ text: `channelID: ${channel.id}` })
    .setColor("DarkOrange")
    .setTimestamp();

    if (data.channel_config.enabled) {
      if (!data.channel_config.cid) return;
      const loggingChannel = await channel.guild.channels.fetch(data.channel_config.cid);
      if (loggingChannel) {
        loggingChannel.send({ embeds: [embed] });
      }
    }
};
