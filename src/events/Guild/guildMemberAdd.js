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
      /**
       * {member} = member mention
       * {guild/guld.name} guild name
       * {new} new line (\n)
       * {count} member count in the guild
       */

      const message = data.welcome.message
        ? data.welcome.message
            .replaceAll("{member}", member)
            .replaceAll("{guild}", member.guild.name)
            .replaceAll("{guild.name}", member.guild.name)
            .replaceAll("{count}", member.guild.memberCount)
            .replaceAll("{new}", "\n")
        : `${member} just joined the server, say hello!\n- ${member.guild.name} now has ${member.guild.memberCount}`;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.displayName,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(message)
        .setColor("Green")
        .setTimestamp();

      const channel = await member.guild.channels.fetch(data.welcome.channel);
      if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
      }
    }
  },
};
