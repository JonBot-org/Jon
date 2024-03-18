import { EmbedBuilder, Events, Interaction } from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";
import { Embed } from "../../Mongo/Models/Embed";

export const config: EventConfigOptions = {
  name: Events.InteractionCreate,
  once: false,
};

export async function run(interaction: Interaction) {
  const client = interaction.client as JonBot;

  if (interaction.isModalSubmit()) {
    const customID = interaction.customId;

    if (customID.split(".")[0] === "embed_body") {
      await interaction.deferReply({ ephemeral: true });
      const name = customID.split(".")[1];
      const data = await Embed.findOne({ name });
      if (data && data.user?.id != interaction.user.id) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`**You can't manage this embed.**`)
          .setColor("Orange")
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      const description = interaction.fields.fields.get("description");
      const title = interaction.fields.fields.get("title");
      const image = interaction.fields.fields.get("image");
      const thumbnail = interaction.fields.fields.get("thumbnail");

      await Embed.findOneAndUpdate(
        { name },
        {
          description: description?.value,
          title: title?.value,
          image: image?.value,
          thumbnail: thumbnail?.value,
        },
      );

      const completeEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`**Saved embed settings.**`)
        .setColor("Blurple")
        .setTimestamp();

      return interaction.editReply({ embeds: [completeEmbed] });
    } else if (customID.split(".")[0] === "embed_a&f") {
      await interaction.deferReply({ ephemeral: true });
      const name = customID.split(".").at(1);
      const data = await Embed.findOne({ name });

      if (data && data.user?.id != interaction.user.id) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`**You can't manage this embed.**`)
          .setColor("Orange")
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      const authorName = interaction.fields.fields.get("author_name");
      const authorIcon = interaction.fields.fields.get("author_icon");
      const footerText = interaction.fields.fields.get("footer_text");
      const footerIcon = interaction.fields.fields.get("footer_icon");
      const timestamp = interaction.fields.fields.get("timestamp");

      await Embed.findOneAndUpdate(
        { name },
        {
          author: {
            name: authorName?.value,
            iconURL: authorIcon?.value,
          },
          footer: {
            text: footerText?.value,
            iconURL: footerIcon?.value,
          },
          timestamp: timestamp?.value,
        },
      );

      const completeEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`**Saved embed settings.**`)
        .setColor("Blurple")
        .setTimestamp();

      return interaction.editReply({ embeds: [completeEmbed] });
    }
  }
}
