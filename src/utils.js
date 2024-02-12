const { GuildMember } = require("discord.js");

module.exports = {
  emojis: {
    true: '<:u_t:1200466489703157831>',
    false: '<:u_f:1200466558733004811>'
  },

  /**
   * @param {Boolean} param
   */
  emojify: (param) => {
    return param ? '<:u_t:1200466489703157831>' : '<:u_f:1200466558733004811>';
  },

  /**
   * @param {String} message
   * @param {GuildMember} member
   */
  replaceAllMemberDescriptipn: (message, member) => {
    return message
    .replaceAll('{guild.name}', member.guild.name)
    .replaceAll('{guild.memberCount}', member.guild.memberCount)
    .replaceAll('{member}', member)
    .replaceAll('{member::user.username}', member.user.username)
    .replaceAll('{member::user.avatar}', member.user.displayAvatarURL())
    .replaceAll('{member::user.id}', member.user.id)
    .replaceAll('{member.joinedAt}', member.joinedAt)
    .replaceAll('{n}', '\n');
  }
};
