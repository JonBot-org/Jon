const {
  Events,
  EmbedBuilder,
  AuditLogEvent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { convertNumberToType } = require("../../lib/functions");
const logging = require('../../db/logging');

module.exports.data = {
  name: Events.ChannelCreate,
  once: false,
};

/**
 * @param {import('discord.js').GuildBasedChannel} channel
 * @param {import('discord.js').Client} client
 */
module.exports.execute = async (channel, client) => {
  const data = await logging.findOne({ id: channel.guildId });
  if (!data) return;

  const iconURL = channel.guild.iconURL()
    ? channel.guild.iconURL()
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  const audit = (
    await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
      limit: 1,
    })
  ).entries.first();

  const embed = new EmbedBuilder()
    .setAuthor({ name: channel.guild.name, iconURL })
    .setDescription(
      `**Channel Create**\n» **Executor:** <@${audit.executorId}>\n» **Created At:** <t:${(new Date(channel.createdAt).getTime() / 1000).toFixed(0)}>\n» **Type:** ${convertNumberToType(channel.type)}`,
    )
    .setFooter({ text: `channelID: ${channel.id}` })
    .setColor("DarkOrange")
    .setTimestamp();

  if (channel.topic) {
    embed.data.description += `\n» **Topic:** ${channel.topic}`;
  }

  if (channel.nsfw) {
    embed.data.description += `\n» **Nsfw:** Yes`;
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("View Channel")
      .setURL(channel.url),
  );

  if (data.channel_config.enabled) {
    if (!data.channel_config.cid) return;
    const logChannel = await channel.guild.channels.fetch(data.channel_config.cid);
    if (logChannel) {
      logChannel.send({ embeds: [embed], components: [row] })
    }
  }
};
