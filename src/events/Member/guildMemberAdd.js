const { Events, EmbedBuilder, Colors } = require("discord.js");
const guilds = require("../../db/guilds");
const { replaceVariables } = require("../../lib/functions");

module.exports.data = {
  name: Events.GuildMemberAdd,
  once: false,
};

/**
 * @param {import('discord.js').GuildMember} member
 */
module.exports.execute = async (member) => {
  await member.fetch();
  const data = await guilds.findOne({ id: member.guild.id });

  if (!data) return;

  if (data.configurations.greet.enabled) {
    console.log(data.configurations.greet);
    // Variables
    const Options = {};
    const message = data.configurations.greet.message
      ? replaceVariables("d-m", data.configurations.greet.message, member)
      : replaceVariables("d-m", "{user}, **Welcome!**", member);
    const description = data.configurations.greet.description
      ? replaceVariables("d-m", data.configurations.greet.description, member)
      : replaceVariables(
          "d-m",
          "✨ Created At: {user_createdTimestamp}&n&✨ Joined At: {user_joinedTimestamp}",
          member,
        );
    const title = data.configurations.greet.title
      ? replaceVariables("d-m", data.configurations.greet.title, member)
      : replaceVariables("d-m", "{server_name} now has {server_members} members.", member);
    const author_name = data.configurations.greet.author_name
      ? replaceVariables("a-n", data.configurations.greet.author_name, member)
      : replaceVariables("a-n", "{user_name}", member);
    const author_icon = data.configurations.greet.author_icon
      ? replaceVariables("a-i", data.configurations.greet.author_icon, member)
      : replaceVariables("a-i", "{user_avatar}", member);
    const color = data.configurations.greet.color
      ? Colors[data.configurations.greet.color]
      : Colors.DarkVividPink;
    const timestamp = data.configurations.greet.timestamp;

    console.log(
      message,
      description,
      title,
      author_name,
      author_icon,
      color,
      timestamp,
    );

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
      data.configurations.greet.channel,
    );
    if (channel) {
      channel.send(Options);
    }
  }
};
