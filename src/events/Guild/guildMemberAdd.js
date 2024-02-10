const { Events, GuildMember, EmbedBuilder } = require("discord.js");
const { guilds } = require("../../mongo/index");
const { emojis } = require("../../utils");

module.exports = {
  name: Events.GuildMemberAdd,
  type: "client",
  /**
   * @param {GuildMember} member
   */
  run: async (member) => {
    const data = await guilds.findOne({ Id: member.guild.id });

    if (data && data.welcome.enabled) {
      const message = data.welcome.message;
      const embed = new EmbedBuilder()
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() })
        .setDescription(
          `${message.replaceAll("{member}", member).replaceAll("{new}", "\n").replaceAll("{guild.name}", member.guild.name)}`,
        )
        .setColor("Green")
        .setTimestamp();

      const channel = await member.guild.channels.fetch(data.welcome.channel);
      if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
      }
    }
  },
};
