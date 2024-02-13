const { Events, EmbedBuilder } = require("discord.js");
const { guilds } = require("../../mongo/index");
const { replaceAllMemberDescriptipn } = require("../../utils");

module.exports = {
  name: Events.GuildMemberAdd,
  type: "client",
  /**
   * @param {import('discord.js').GuildMember} member
   */
  run: async (member) => {
    const data = await guilds.findOne({ Id: member.guild.id });

    if (data && data.welcome.enabled) {
      const message = data.welcome.message
        ? replaceAllMemberDescriptipn(data.welcome.message, member)
        : `${member} just joined the server, say hello!\n- ${member.guild.name} now has ${member.guild.memberCount}`;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.displayName,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(message)
        .setColor("Random")
        .setTimestamp();

      const channel = await member.guild.channels.fetch(data.welcome.channel);
      if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
      }
    }
  },
};
