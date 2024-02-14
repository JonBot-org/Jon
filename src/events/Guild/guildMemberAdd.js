const { Events, EmbedBuilder } = require("discord.js");
const db = require("../../mongo/index");
const { replaceAllMemberDescription } = require("../../utils");

module.exports = {
  name: Events.GuildMemberAdd,
  type: "client",
  /**
   * @param {import('discord.js').GuildMember}
   */
  run: async (member) => {
    await member.fetch();
    const { guild } = member;
    const data = await db.guilds.findOne({ Id: guild.id });
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor(
        data ? (data.welcome.color ? data.welcome.color : "Random") : "Random",
      );

    if (data && data.welcome.enabled) {
      let messageObject = {};
      if (data.welcome.content && data.welcome.description) {
        messageObject = {
          content: replaceAllMemberDescription(data.welcome.content, member),
          embeds: [
            embed.setDescription(
              replaceAllMemberDescription(data.welcome.description, member),
            ),
          ],
        };
      } else if (!data.welcome.content && data.welcome.description) {
        messageObject = {
          embeds: [
            embed.setDescription(
              replaceAllMemberDescription(data.welcome.description, member),
            ),
          ],
        };
      } else if (data.welcome.content && !data.welcome.description) {
        messageObject = {
          content: replaceAllMemberDescription(data.welcome.content, member),
        };
      }

      const channel = await guild.channels.fetch(data.welcome.channel);
      if (channel) {
        channel.send(messageObject);
      }
    }
  },
};
