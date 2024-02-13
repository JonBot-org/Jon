const { Events, EmbedBuilder } = require("discord.js");
const { guilds } = require("../../mongo/index");
const { replaceAllMemberDescriptipn } = require("../../utils");

module.exports = {
  name: Events.GuildMemberRemove,
  type: "client",
  /**
   *
   * @param {import('discord.js').GuildMember} member
   */
  run: async (member) => {
    const data = await guilds.findOne({ Id: member.guild.id });

    if (data && data.leaves.enabled) {
      const message = data.leaves.message
        ? replaceAllMemberDescriptipn(data.leaves.message, member)
        : `**${member.user.username}** just left the server.\nWe now have **${member.guild.memberCount}** members.`;

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
