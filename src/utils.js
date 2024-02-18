const chalk = require("chalk");
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
   * @param {Boolean} param
   */
  enabled(param) {
    return param ? "<:u_a:1201528414675423232>" : "<:u_d:1201528533906882720>";
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

  /**
   * @param {string} t
   * @param {any} message
   */
  log(t, message) {
    if (t === "i") {
      console.log(
        chalk.bgHex("#BAC506")("[INFO]"),
        chalk.hex("#8F7DFF")("||"),
        chalk.hex("#808B88")(message),
      );
    } else if (t === "w") {
      console.log(
        chalk.bgHex("#ffb3ba")("[WARN]"),
        chalk.hex("#A93133")("||"),
        message,
      );
    } else if (t === "e") {
      console.log(
        chalk.bgHex("#FA8072")("[ERROR]"),
        chalk.hex("#bae1ff")("||"),
        message,
      );
    }
  },
};
