const { Events, EmbedBuilder, Colors } = require("discord.js");
const guilds = require("../../db/guilds");
const { replaceVariables } = require("../../lib/functions");

module.exports.data = {
  name: Events.GuildMemberAdd,
  once: false,
};

/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Client} client
 */
module.exports.execute = async (member, client) => {
  const { guild } = member;
  const data = await guilds.findOne({ id: guild.id });

  if (data && data.configurations.greet.enabled) {
    let messageObject = {};
    if (data.configurations.greet.description) {
      const embed = new EmbedBuilder()
        .setDescription(
          replaceVariables(
            "d-m",
            data.configurations.greet.description,
            member,
          ),
        )
        .setColor(
          data.configurations.greet.color
            ? Colors[data.configurations.greet.color]
            : "Random",
        );

      if (data.configurations.greet.timestamp === "YES") {
        embed.setTimestamp();
      }

      if (data.configurations.greet.author_icon) {
        embed.setAuthor({
          name: replaceVariables(
            "a_n",
            data.configurations.greet.author_name,
            member,
          ),
          iconURL: replaceVariables(
            "a_i",
            data.configurations.greet.author_icon,
            member,
          ),
        });
      }

      if (data.configurations.greet.title) {
        embed.setTitle(
          replaceVariables("t", data.configurations.greet.title, member),
        );
      }

      messageObject = { embeds: [embed] };
    }

    if (data.configurations.greet.message) {
      Object.assign(messageObject, {
        content: replaceVariables(
          "d-m",
          data.configurations.greet.message,
          member,
        ),
      });
    }

    const channel = await guild.channels.fetch(
      data.configurations.greet.channel,
    );
    if (channel) {
      channel.send(messageObject);
    }
  }
};
