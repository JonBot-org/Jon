const { Events, EmbedBuilder } = require("discord.js");
const db = require("../../mongo/index");
const { replaceAllMemberDescription } = require("../../utils");

module.exports = {
  name: Events.GuildMemberRemove,
  type: "client",
  /**
   * @param {import('discord.js').GuildMember} member
   */
  run: async (member) => {
    const { guild } = member;
    const data = await db.guilds.findOne({ Id: guild.id });
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setColor(
        data ? (data.leaves.color ? data.leaves.color : "Random") : "Random",
      )
      .setTimestamp();

    if (data && data.leaves.enabled) {
      let messageObject = {};
      if (data.leaves.content && data.leaves.description) {
        messageObject = {
          content: replaceAllMemberDescription(data.leaves.content, member),
          embeds: [
            embed.setDescription(
              replaceAllMemberDescription(data.leaves.description, member),
            ),
          ],
        };
      } else if (!data.leaves.content && data.leaves.description) {
        messageObject = {
          embeds: [
            embed.setDescription(
              replaceAllMemberDescription(data.leaves.description, member),
            ),
          ],
        };
      } else if (data.leaves.content && !data.leaves.description) {
        messageObject = {
          content: replaceAllMemberDescription(data.leaves.content, member),
        };
      }

      const channel = await guild.channels.fetch(data.leaves.channel);
      if (channel) {
        channel.send(messageObject);
      }
    }
  },
};
