const { Events, GuildMember, EmbedBuilder, Colors } = require("discord.js");
const guilds = require("../../db/guilds");
const { replaceVariables } = require("../../lib/functions");

module.exports.data = {
  name: Events.GuildMemberRemove,
  once: false,
};

/**
 * @param {import('discord.js').GuildMember|import("discord.js").APIGuildMember} member
 */
module.exports.execute = async (member) => {
  if ((!member) instanceof GuildMember) return;
  const data = await guilds.findOne({ id: member.guild.id });
  if (!data) return;

  if (data.configurations.leave.enabled) {
    const Options = {};
    const message = data.configurations.leave.message
      ? replaceVariables("d-m", data.configurations.leave.message, member)
      : replaceVariables("d-m", "{user}, **Left.**", member);
    const description = data.configurations.leave.description
      ? replaceVariables("d-m", data.configurations.leave.description, member)
      : replaceVariables(
          "d-m",
          "✨ Created At: {user_createdTimestamp}&n&✨ Joined At: {user_joinedTimestamp}",
          member,
        );
    const title = data.configurations.leave.title
      ? replaceVariables("d-m", data.configurations.leave.title, member)
      : replaceVariables(
          "d-m",
          "{server_name} now has {server_members} members.",
          member,
        );
    const author_name = data.configurations.leave.author_name
      ? replaceVariables("a-n", data.configurations.leave.author_name, member)
      : replaceVariables("a-n", "{user_name}", member);
    const author_icon = data.configurations.leave.author_icon
      ? replaceVariables("a-i", data.configurations.leave.author_icon, member)
      : replaceVariables("a-i", "{user_avatar}", member);
    const color = data.configurations.leave.color
      ? Colors[data.configurations.leave.color]
      : Colors.DarkVividPink;
    const timestamp = data.configurations.leave.timestamp;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);

    if (author_name !== undefined) {
      embed.setAuthor({ name: author_name, iconURL: author_icon });
    }

    if (timestamp === "YES") {
      embed.setTimestamp();
    }

    Object.assign(Options, { content: message, embeds: [embed] });

    const channel = await member.guild.channels.fetch(
      data.configurations.leave.channel,
    );
    if (channel) {
      channel.send(Options);
    }
  }
};
