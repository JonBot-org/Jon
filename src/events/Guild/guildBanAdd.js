const { Events, EmbedBuilder } = require("discord.js");
const db = require("../../mongo/index");

module.exports = {
  name: Events.GuildBanAdd,
  type: "client",
  /**
   * @param {import('discord.js').GuildBan} ban
   */
  run: async (ban) => {
    try {
      if (ban.partial) await ban.fetch();
      const data = await db.config.findOne({ Id: ban.guild.id });
      if (data && !data.mod_logs.enabled) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: ban.user.username,
          iconURL: ban.user.displayAvatarURL(),
        })
        .setThumbnail(ban.user.displayAvatarURL())
        .setDescription(`**${ban.user} (${ban.user.username}) was banned.**`)
        .setFooter({ text: `guildID: ${ban.guild.id}` })
        .setColor("DarkPurple")
        .setTimestamp();

      const channel = await ban.guild.channels.fetch(data.mod_logs.channel);
      if (channel) {
        channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
