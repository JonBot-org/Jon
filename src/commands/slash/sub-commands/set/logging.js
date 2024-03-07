const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
} = require("discord.js");
const {
  set: { logging },
} = require("../../../../Strings/messages.json");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply();
  const { user } = interaction;

  const typeSelectEmbed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setDescription(logging["embed.select"])
    .setColor("LuminousVividPink")
    .setTimestamp();

  const typeSelectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("logging-type")
      .setPlaceholder("Select A Type To Configure.")
      .setMaxValues(1)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Channel")
          .setDescription("Configure Channel Logging Settings.")
          .setValue("channel"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Message")
          .setDescription("Configure Message Logging Settings.")
          .setValue("message"),
      ),
  );

  interaction.editReply({
    embeds: [typeSelectEmbed],
    components: [typeSelectRow],
  });
};
