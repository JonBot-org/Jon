const { ChatInputCommandInteraction } = require("discord.js");
const embeds = require("../../mongoose/schema/embeds");
const { Utils } = require("../../helpers/utils");
const moment = require("moment");
const { Templates } = require("../../helpers/templates");

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const name = interaction.options.getString("name");
  const data = await embeds.findOne({ name });

  if (data) {
    return interaction.editReply({
      embeds: [
        Utils.embeds.createUserError(interaction, [
          "duplicate name",
          `There is a another embed with the same name, embeds can't have duplicate names.`,
        ]),
      ],
    });
  }

  const embed = Utils.embeds
    .createTemplate(interaction)
    .setDescription(
      `**Please confirm if you want to create this embed. \`(${name})\`**\n> This embed will be created with a simple template.`,
    )
    .setColor("Blurple");

  const message = await interaction.editReply({
    embeds: [embed],
    components: [Utils.buttons.createConfirm()],
  });

  const collector = message.createMessageComponentCollector();

  collector.on("collect", async (button) => {
    await button.deferUpdate();
    const { customId } = button;

    if (customId === "utils-no") {
      const embed = Utils.embeds
        .createTemplate(interaction)
        .setDescription("**Okay, embed creation cancelled.**")
        .setColor("Blurple");

      return button.editReply({ embeds: [embed], components: [] });
    } else {
      await embeds.create({
        name: name,
        authorId: interaction.user.id,
        createdTime: `${moment().format("DD/MM/YYYY hh:mm")}`,
        guildId: interaction.guildId,

        author: {
          name: Templates.embed_c.author.name,
          iconURL: Templates.embed_c.author.iconURL,
        },

        footer: {
          text: Templates.embed_c.footer.text,
        },

        description: Templates.embed_c.description,
        image: Templates.embed_c.image,
        thumbnail: Templates.embed_c.thumbnail,
        timestamp: Templates.embed_c.timestamp,
      });

      const embed = Utils.embeds
        .createTemplate(interaction)
        .setDescription(
          `**Created embed.**\n- Name: ${name}\n- Author: ${interaction.user.username}`,
        )
        .setColor("Blurple");

      return interaction.editReply({ embeds: [embed], components: [] });
    }
  });
};
