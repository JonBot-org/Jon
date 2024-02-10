const {
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  EmbedBuilder,
  codeBlock,
} = require("discord.js");
const { emojis } = require("../utils");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("delete")
    .setType(ApplicationCommandType.Message),
  /**
   * @param {MessageContextMenuCommandInteraction} interaction
   */
  run: async (interaction) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (!interaction.targetMessage.author.id === interaction.client.user.id) {
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              `${emojis.utility.false.raw} | **I can't delete this message, this message does not belong to me.**`,
            )
            .setColor("Orange"),
        ],
        ephemeral: true,
      });
    }

    if (!interaction.targetMessage.interaction) {
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              `${emojis.utility.false.raw} | **This message is not a interaction command, i can't delete this.**`,
            )
            .setColor("Orange"),
        ],
        ephemeral: true,
      });
    }

    if (
      !interaction.targetMessage.interaction.user.id === interaction.user.id
    ) {
      return interaction.reply({
        embeds: [
          embed
            .setDescription(
              `${emojis.utility.false.raw} | **You did not use this interaction command.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    try {
      const message = await interaction.targetMessage.fetch();
      message.delete();
      return interaction.reply({
        embeds: [
          embed
            .setDescription(`${emojis.utility.true.raw} | **Done!**`)
            .setColor("Green"),
        ],
        ephemeral: true
      });
    } catch (error) {
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `${emojis.utility.false.raw} | **Error deleting this message...**\n\n${codeBlock(error)}`,
          ).setColor('Red')
        ],
        ephemeral: true
      });
    }
  },
};
