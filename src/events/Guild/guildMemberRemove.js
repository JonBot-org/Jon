const { Events, GuildMember, EmbedBuilder } = require("discord.js");
const { guilds } = require("../../mongo/index");

module.exports = {
  name: Events.GuildMemberRemove,
  type: "client",
  /**
   *
   * @param {GuildMember} member
   */
  run: async (member) => {
    const data = await guilds.findOne({ Id: member.guild.id });

    if (data && data.leaves.enabled) {
      /**
       * {member} = user username
       * {guild/guild.name} = guild name
       * {new} = new line (\n)
       * {count} = guild member count
       */

      const message = data.leaves.message
        ? data.leaves.message
            .replaceAll("{member}", member.user.username)
            .replaceAll("{guild}", member.guild.name)
            .replaceAll("{guild.name}", member.guild.name)
            .replaceAll("{new}", "\n")
            .replaceAll("{count}", member.guild.memberCount)
        : `**${member.user.username}** just left the server ):\nWe now have **${member.guild.memberCount}**.`;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(message)
        .setColor("Orange")
        .setTimestamp();

      const channel = await member.guild.channels.fetch(data.leaves.channel);
      if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
      }
    }
  },
};
