const { default: chalk } = require("chalk");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  ImageFormat,
} = require("discord.js");
const moment = require("moment");

module.exports.Utils = {
  // Button Utilities.
  buttons: {
    createConfirm: () => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`utils-no`)
          .setStyle(ButtonStyle.Danger)
          .setLabel("No"),
        new ButtonBuilder()
          .setCustomId("utils-yes")
          .setStyle(ButtonStyle.Success)
          .setLabel("Yes"),
      );
    },
  },

  // Embed Utilities.
  embeds: {
    /**
     * @param {import("discord.js").Interaction} interaction
     */
    createTemplate: (interaction) => {
      return new EmbedBuilder()
        .setAuthor({
          name: `@${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
    },

    /**
     * @param {import("discord.js").Interaction} interaction
     * @param {[]} error
     * Uh-Oh, we got a [type]
     * [type, error]
     */
    createUserError: (interaction, error) => {
      return new EmbedBuilder()
        .setAuthor({
          name: `@${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `**Uh-Oh, we got a \`${error.at(0).toLowerCase()}\` error**\n${error.at(1)}`,
        )
        .setColor("Orange")
        .setTimestamp();
    },
  },

  // Logger Utilities.
  write: {
    info: (message) => {
      console.log(
        chalk.greenBright("+ INFO"),
        chalk.redBright(moment().format("M/D hh:mm")),
        "^_^",
        message,
      );
    },

    warn: (message) => {
      console.log(
        chalk.greenBright("+ WARN"),
        chalk.redBright(moment().format("M/D hh:mm")),
        "WuW",
        message,
      );
    },

    error: (message) => {
      console.log(
        chalk.greenBright(`+ ERROR`),
        chalk.redBright(moment().format("M/D hh:mm")),
        "0-0",
        message,
      );
    },
  },

  parse: {
    /**
     * @param {string} str
     * @param {GuildMember} member
     */
    variables: (member, str) => {
      return str
      .replaceAll('{user.name}', member.user.username)
      .replaceAll('{user.pfp}', member.user.displayAvatarURL({ extension: ImageFormat.PNG, size: 524 }))
      .replaceAll('{user.createdAt}', moment(new Date(member.user.createdAt)).format('DD/MM/YYYY'))
      .replaceAll('{user.joinedAt}', moment(new Date(member.joinedAt)).format('DD/MM/YYYY'))

      .replaceAll('{utils.getTime}', moment().format('hh:mm:s'))
      .replaceAll('{utils.getDate}', moment().format('DD/MM/YYYY'))
    }
  },

  //  Client Utilities.
};
