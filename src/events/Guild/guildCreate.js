const {
  Events,
  Guild,
  EmbedBuilder,
  AuditLogEvent,
  WebhookClient,
} = require("discord.js");
const blacklist = require("../../json/blacklist.json");
const whitelist = require("../../json/whitelist.json");
const chalk = require("chalk");

module.exports = {
  name: Events.GuildCreate,
  type: "client",
  /**
   * @param {Guild} guild
   */
  run: async (guild) => {
    if (process.env.NODE_ENV === "development") return;

    if (blacklist.join.includes(guild.id)) return guild.leave();

    if (!whitelist["10_limit"].includes(guild.id) && guild.memberCount < 10) {
      const audit = await guild.fetchAuditLogs({
        type: AuditLogEvent.BotAdd,
        limit: 1,
      });

      const user = await guild.members.fetch(audit.entries.first().executorId);

      if (!user) return;

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setDescription(
          `**Hey, thanks for adding this bot to ${guild.name}, unfortunately you're server has less than 10 members so the bot has been auto removed.**\n\n**Why?**\n> *The bot is yet to be verified, we (developers) want servers that has more than 10 members to access the bot*`,
        )
        .setColor("Red")
        .setTimestamp();

      user.send({ embeds: [embed] }).catch();

      return guild.leave();
    }

    if (process.env.GUILD_CREATE_HOOK === undefined) return;

    const webhook = new WebhookClient({ url: process.env.GUILD_CREATE_HOOK });

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setDescription(`**Jon, has been added to ${guild.name}.** 🎉`)
      .addFields(
        {
          name: "Guild/Owner",
          value: `Guild: ${guild.id} / Owner: ${guild.ownerId}`,
        },
        {
          name: "Members",
          value: `${guild.memberCount}`,
        },
      )
      .setColor("Green")
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  },
};
