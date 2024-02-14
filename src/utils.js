const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  emojis: {
    true: "<:u_t:1200466489703157831>",
    false: "<:u_f:1200466558733004811>",
  },

  /**
   * @param {Boolean} param
   */
  emojify: (param) => {
    return param ? "<:u_t:1200466489703157831>" : "<:u_f:1200466558733004811>";
  },

  /**
   * @param {String} message
   * @param {import('discord.js').GuildMember} member
   */
  replaceAllMemberDescription: (message, member) => {
    return message
      .replaceAll("{guild.name}", member.guild.name)
      .replaceAll("{guild.memberCount}", member.guild.memberCount)
      .replaceAll("{member}", member)
      .replaceAll("{member.name}", member.user.username)
      .replaceAll("{member.id}", member.user.id)
      .replaceAll("{n}", "\n")
      .replaceAll("{new}", "\n");
  },

  /**
   * @param {string} label
   * @returns {}
   */
  createDisabledButton(label) {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(label)
          .setDisabled(true)
          .setStyle(ButtonStyle.Danger)
          .setCustomId("disabled"),
      )
      .toJSON();
  },
};
