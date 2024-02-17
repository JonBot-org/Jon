const { Events, EmbedBuilder, WebhookClient } = require("discord.js");
const db = require("../../mongo/index");

module.exports = {
  name: Events.GuildDelete,
  type: "client",
  /**
   * @param {import('discord.js').Guild} guild
   */
  run: async (guild) => {
    const data = await db.guilds.findOne({ Id: guild.id });
    if (data) {
      await db.guilds.deleteOne({ Id: guild.id });
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setDescription(`Guild/Owner ID:\n- ${guild.id} | ${guild.ownerId}`)
      .setColor("Red")
      .setTimestamp();

    if (process.env.GUILD_CREATE_HOOK === undefined) return;

    const webhook = new WebhookClient({ url: process.env.GUILD_CREATE_HOOK });

    return await webhook.send({ embeds: [embed] });
  },
};
