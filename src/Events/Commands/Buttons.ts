import {
  ActionRowBuilder,
  EmbedBuilder,
  Events,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";
import Guilds from "../../Mongo/Models/Guilds";
import { Embed } from "../../Mongo/Models/Embed";
import { Bot } from "../../Mongo/Models/Bot";

export const config: EventConfigOptions = {
  name: Events.InteractionCreate,
  once: false,
};

export async function run(interaction: Interaction) {
  const client = interaction.client as JonBot;

  if (interaction.isButton()) {
    await Bot.findOneAndUpdate(
      {
        _i: process.env.MIP,
      },
      { $inc: { buttonsClicked: 1 } },
      { upsert: true },
    ).catch(console.error);

    const customID = interaction.customId;
    if (customID.split("-")[0] != "u") return;

    if (customID.split(".")[0] === "u-accept_stdb_yes") {
      await interaction.deferUpdate();
      const data = await Guilds.findOne({ id: interaction.guildId });
      if (data) {
        await data?.updateOne({
          tos: true,
        });
      } else {
        await Guilds.create({
          id: interaction.guildId,
          tos: true,
        });
      }

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription("**Thank you!**\n\n> You can now use commands.")
        .setColor("Blurple")
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], components: [] });
    } else if (customID.split(".")[0] === "u-accept_stdb_no") {
      interaction.reply({
        ephemeral: true,
        content: `Okay, I won't store data.`,
      });
    } else if (customID.split(".")[0] === "u-embed_edit_body") {
      const data = await Embed.findOne({ name: customID.split(".").at(1) });

      if (!data)
        return interaction.reply({
          content: `I can't find this embed in the database`,
          ephemeral: true,
        });

      const modal = new ModalBuilder()
        .setTitle("Embed Body")
        .setCustomId(`embed_body.${customID.split(".")[1]}`);

      const description =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("description")
            .setRequired(false)
            .setLabel("Description")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("The embed description to display.")
            .setMaxLength(4000)
            .setValue(data.description ? data.description : ""),
        );
      const title = new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("title")
          .setLabel("Title")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("The embed title to display.")
          .setMaxLength(256)
          .setRequired(false)
          .setValue(data.title ? data.title : ""),
      );
      const image = new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("image")
          .setLabel("Image")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("An image url.")
          .setMaxLength(500)
          .setRequired(false)
          .setValue(data.image ? data.image : ""),
      );
      const thumbnail = new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("thumbnail")
          .setLabel("Thumbnail")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("An image url")
          .setMaxLength(500)
          .setRequired(false)
          .setValue(data.thumbnail ? data.thumbnail : ""),
      );

      await interaction.showModal(
        modal.addComponents(title, description, thumbnail, image),
      );
    } else if (customID.split(".")[0] === "u-embed_edit_a&f") {
      const data = await Embed.findOne({ name: customID.split(".").at(1) });

      if (!data)
        return interaction.reply({
          content: `I can't find this embed in the database.`,
          ephemeral: true,
        });

      const modal = new ModalBuilder()
        .setTitle("Embed Author & Footer")
        .setCustomId(`embed_a&f.${customID.split(".")[1]}`);

      const author_name =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("author_name")
            .setLabel("Author Name")
            .setPlaceholder("The name of the author to display.")
            .setMaxLength(256)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(data.author.name ? data.author.name : ""),
        );

      const author_icon =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("author_icon")
            .setLabel("Author Icon")
            .setPlaceholder("The icon of the author to display.")
            .setMaxLength(500)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(data.author.iconURL ? data.author.iconURL : ""),
        );

      const footer_text =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("footer_text")
            .setLabel("Footer Text")
            .setPlaceholder("The text of the footer to display.")
            .setMaxLength(2048)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(data.footer.text ? data.footer.text : ""),
        );

      const footer_icon =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("footer_icon")
            .setLabel("Footer Icon")
            .setPlaceholder("The icon of the footer to display.")
            .setMaxLength(500)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(data.footer.iconURL ? data.footer.iconURL : ""),
        );

      const timestamp = new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("timestamp")
          .setLabel("Timestamp (true/false)")
          .setPlaceholder("Should the embed have a timestamp?")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(5)
          .setRequired(false)
          .setValue(`${data.timestamp}`),
      );

      modal.addComponents(
        author_name,
        author_icon,
        footer_text,
        footer_icon,
        timestamp,
      );
      await interaction.showModal(modal);
    }
  }
}
