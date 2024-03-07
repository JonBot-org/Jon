const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const logging = require("../../db/logging");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,
};

/**
 * @param {import('discord.js').Interaction} interaction
 */
module.exports.execute = async (interaction) => {
  if (!interaction.isButton()) return;

  // About system
  if (interaction.customId === "ab.commands") {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `Please select a category using the select menu.\n\n» **Note:** The select menu has both message command and slash command categories.`,
      )
      .setColor("LuminousVividPink")
      .setTimestamp();

    const categoryRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("ab-commands.category")
        .setMaxValues(1)
        .setPlaceholder("Select A Slash Command Category.")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Set")
            .setDescription("set: Configure the server settings.")
            .setValue("set"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Test")
            .setDescription("test: Test modules.")
            .setValue("test"),
        ),
    );

    const messageCategoryRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("ab-m_commands.category")
        .setMaxValues(1)
        .setPlaceholder("Select A Message Category.")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Bot")
            .setDescription("bot: Bot related commands.")
            .setValue("bot"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Fun")
            .setDescription("fun: Fun, images & misc commands.")
            .setValue("fun"),
        ),
    );

    return interaction.update({
      embeds: [embed],
      components: [categoryRow, messageCategoryRow],
    });
  }

  // Logging system.
  if (interaction.customId === "logging-channel.disable") {
    await interaction.deferUpdate();
    const data = await logging.findOne({ id: interaction.guildId });

    if (data && data.channel_config.enabled) {
      data.channel_config.enabled = false;
      data.channel_config.cid = null;
      await data.save();
    }

    const completeEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`Disabled channel event logging.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [completeEmbed], components: [] });
  } else if (interaction.customId === "logging-message.disable") {
    await interaction.deferUpdate();
    const data = await logging.findOne({ id: interaction.guildId });

    if (data && data.message_config.enabled) {
      data.message_config.enabled = false;
      data.message_config.cid = null;
      await data.save();
    }

    const completeEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`Disabled message event logging.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [completeEmbed], components: [] });
  }
};
