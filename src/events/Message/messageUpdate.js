const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const logging = require("../../db/logging");

module.exports.data = {
  name: Events.MessageUpdate,
  once: false,
};

/**
 * @param {import('discord.js').Message} old
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').Client} client
 */
module.exports.execute = async (old, message, client) => {
  if (old.partial) return;
  if (!message.inGuild()) return;
  if (message.author.id === client.user.id) return;
  if (message.partial) await message.fetch().catch();
  const data = await logging.findOne({ id: message.guildId });
  if (!data) return;

  const changes = {
    content: old.content !== message.content ? true : false,
    embed_description:
      old.embeds[0]?.description !== message.embeds[0]?.description
        ? true
        : false,
  };

  const embed = new EmbedBuilder()
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.displayAvatarURL(),
    })
    .setDescription(
      `**Message Update**\n» **Author:** ${message.author}\n» **Created At:** <t:${(new Date(message.createdAt).getTime() / 1000).toFixed(0)}>\n» **Changes:**\n   » **Content:** ${changes.content}\n   » **Description:** ${changes.embed_description}`,
    )
    .setColor("DarkOrange")
    .setFooter({ text: `messageID: ${message.id}` })
    .setTimestamp();

  if (old.content !== message.content) {
    embed.addFields({
      name: "Content:",
      value: `${old.content.length >= 1024 ? old.content.substring(0, 921) + "..." : old.content} **->** ${message.content.length >= 100 ? message.content.substring(0, 100) + "..." : message.content}`,
    });
  }

  if (old.embeds[0]?.description !== message.embeds[0]?.description) {
    embed.addFields({
      name: "Description:",
      value: `${old.embeds[0]?.description.length >= 1024 ? old.embeds[0]?.description.substring(0, 971) + "..." : old.embeds[0]?.description} **->** ${message.embeds[0]?.description.length >= 50 ? message.embeds[0]?.description.substring(0, 50) + "..." : message.embeds[0]?.description}`,
    });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("View The Full Message")
      .setURL(message.url),
  );

  if (data.message_config.enabled) {
    if (!data.message_config.cid) return;
    const channel = await message.guild.channels.fetch(data.message_config.cid);
    if (channel) {
      channel.send({ embeds: [embed], components: [row] })
    }
  }
};
