const { Events, AuditLogEvent, EmbedBuilder, Guild } = require("discord.js");
const pretty = require("pretty-ms");
const logging = require("../../db/logging");

module.exports.data = {
  name: Events.ChannelUpdate,
  once: false,
};

/**
 * @param {import('discord.js').GuildBasedChannel} old
 * @param {import('discord.js').GuildBasedChannel} channel
 * @param {import('discord.js').Client} client
 */
module.exports.execute = async (old, channel, client) => {
  const data = await logging.findOne({ id: channel.guildId });
  if (!data) return;

  const iconURL = channel.guild.iconURL()
    ? channel.guild.iconURL()
    : "https://cdn.discordapp.com/embed/avatars/0.png";
  const audit = (
    await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelUpdate,
      limit: 1,
    })
  ).entries.first();

  const changes = {
    name: old.name !== channel.name ? true : false,
    topic: old.topic !== channel.topic ? true : false,
    nsfw: old.nsfw !== channel.nsfw ? true : false,
    slowmode: old.rateLimitPerUser !== channel.rateLimitPerUser ? true : false,
  };

  const embed = new EmbedBuilder()
    .setAuthor({ name: channel.guild.name, iconURL })
    .setDescription(
      `**Channel Updated**\n» **Executor:** <@${audit.executorId}>\n» **Created At:** <t:${(new Date(channel.createdAt).getTime() / 1000).toFixed(0)}>\n» **Channel:** ${channel}`,
    )
    .setFooter({ text: `channelID: ${channel.id}` })
    .setColor("DarkOrange")
    .setTimestamp();

  embed.data.description += `\n» **Changes:**\n   » **Name:** ${changes.name}\n   » **Topic:** ${changes.topic}\n   » **Nsfw:** ${changes.nsfw}\n   » **Slowmode:** ${changes.slowmode}`;

  if (old.name !== channel.name) {
    embed.addFields({
      name: "Name:",
      value: `${old.name} **->** ${channel.name}`,
    });
  }

  if (old.topic !== channel.topic) {
    embed.addFields({
      name: "Topic:",
      value: `${old.topic} **->** ${channel.topic}`,
    });
  }

  if (old.nsfw !== channel.nsfw) {
    embed.addFields({
      name: "Nsfw:",
      value: `${old.nsfw ? "Yes" : "No"} **->** ${channel.nsfw ? "Yes" : "No"}`,
    });
  }

  if (old.rateLimitPerUser !== channel.rateLimitPerUser) {
    embed.addFields({
      name: "Slowmode:",
      value: `${pretty(old.rateLimitPerUser * 1000, { compact: true })} **->** ${pretty(channel.rateLimitPerUser * 1000, { compact: true })}`,
    });
  }

  if (data.channel_config.enabled) {
    if (!data.channel_config.cid) return;
    const loggingChannel = await channel.guild.channels.fetch(
      data.channel_config.cid,
    );
    if (loggingChannel) {
      loggingChannel.send({ embeds: [embed] });
    }
  }
};
