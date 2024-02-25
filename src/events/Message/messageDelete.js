const {
  Events,
  EmbedBuilder
} = require("discord.js");
const logging = require('../../db/logging');

module.exports.data = {
  name: Events.MessageDelete,
  once: false,
};

/**
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').Client} client
 */
module.exports.execute = async (message, client) => {
  if (message.partial) return;
  if (!message.inGuild()) return;
  if (message.author.id === client.user.id) return;
  const data = await logging.findOne({ id: message.guildId });
  if (!data) return;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.displayAvatarURL(),
    })
    .setFooter({ text: `messageID: ${message.id}` })
    .setTimestamp()
    .setColor("DarkOrange")
    .setDescription(
      `**Message Delete**\n» **Author:** ${message.author}\n» **Created At:** <t:${(new Date(message.createdAt).getTime() / 1000).toFixed(0)}>\n» **Channel:** ${message.channel}`,
    );

  if (message.content) {
    embed.data.description += `\n\n\`${message.cleanContent}\``;
  }

  if (message.attachments.size > 0) {
    embed.addFields({
      name: `Attachment(s):`,
      value: `${message.attachments.map((value) => `[${value.name}:${value.size}](${value.url})`).join(" | ")}`,
    });
  }

  if (data.message_config.enabled) {
    if (!data.message_config.cid) return;
    const channel = await message.guild.channels.fetch(data.message_config.cid);
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  }
};
