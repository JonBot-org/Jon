const { Events, EmbedBuilder } = require("discord.js");
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
  const { guild } = member;
  const data = await guilds.findOne({ id: guild.id });
  if (!data) return;

  if (data.configurations.greet.enabled) {
    const embed = new EmbedBuilder();
    let MessageSendOptions = {};

    if (
      !data.configurations.greet.message &&
      !data.configurations.greet.description
    ) {
      embed
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setThumbnail(guild.iconURL())
        .setDescription(
          `\`${member.user.username}\` just joined \`${guild.name}\` 👋\n\n`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      if (guild.rulesChannelId) {
        embed.data.description += `» **Rules:** <#${guild.rulesChannelId}>`;
      }

      Object.assign(MessageSendOptions, {
        embeds: [embed],
        content: `${member} 👋`,
      });
    } else {
      embed.setColor(
        data.configurations.greet.color
          ? data.configurations.greet.color
          : "LuminousVividPink",
      );

      if (data.configurations.greet.timestamp === "YES") {
        embed.setTimestamp();
      }

      if (data.configurations.greet.author_icon) {
        embed.setAuthor({
          name: replaceVariables(
            "a-n",
            data.configurations.greet.author_name,
            member,
          ),
          iconURL: replaceVariables(
            "a-i",
            data.configurations.greet.author_icon,
            member,
          ),
        });
      } else {
        embed.setAuthor({
          name: replaceVariables(
            "a-n",
            data.configurations.greet.author_name,
            member,
          ),
        });
      }

      if (data.configurations.greet.title) {
        embed.setTitle(
          replaceVariables("d-m", data.configurations.greet.title, member),
        );
      }

      if (data.configurations.greet.description) {
        embed.setDescription(
          replaceVariables(
            "d-m",
            data.configurations.greet.description,
            member,
          ),
        );
      }

      let content = null;
      if (data.configurations.greet.message) {
        content = replaceVariables(
          "d-m",
          data.configurations.greet.message,
          member,
        );
      }

      Object.assign(MessageSendOptions, { embeds: [embed], content });
    }

    const channel = await guild.channels.fetch(
      data.configurations.greet.channel,
    );
    if (channel) {
      channel.send(MessageSendOptions).catch();
    }
  }
};
