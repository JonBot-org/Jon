const { Events, EmbedBuilder } = require("discord.js");
const db = require("../../mongo/index");

module.exports = {
  name: Events.GuildMemberUpdate,
  type: "client",
  /**
   * @param {import('discord.js').GuildMember} oldMember
   * @param {import('discord.js').GuildMember} member
   */
  run: async (oldMember, member) => {
    if (
      oldMember.communicationDisabledUntil !== member.communicationDisabledUntil
    ) {
      if (oldMember.communicationDisabledUntil) return;
      const data = await db.config.findOne({ Id: member.guild.id });
      if (data && !data.mod_logs.enabled) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(`**${member} (${member.user.username}) was muted.**`)
        .setFooter({ text: `guildID: ${member.guild.id}` })
        .setColor("Yellow")
        .setTimestamp();

      sendMod(
        { embeds: [embed] },
        await member.guild.channels.fetch(data.mod_logs.channel),
      );
    }
  },
};

/**
 * @param {import('discord.js').MessagePayload} data
 * @param {import('discord.js').Channel} channel
 */
function sendMod(data, channel) {
  if (channel) {
    channel.send(data);
  }
}
