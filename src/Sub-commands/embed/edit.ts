import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Embed } from "../../Mongo/Models/Embed";

export async function run(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("name", true);
  const data = await Embed.find({ guild: interaction.guildId });

  if (data) {
    const embed = data.find((v) => v.name === name);
    if (embed) {
      if (interaction.user.id != embed.user?.id) {
        const Eembed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `**You can't manage this embed, only <@${embed.user?.id}> \`(${embed.user?.id})\` can.`,
          )
          .setColor("Orange")
          .setTimestamp();

        return interaction.editReply({ embeds: [Eembed] });
      }

      const editEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `**Edit this embed by using the provided buttons below.**`,
        )
        .setColor("Blurple")
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`u-embed_edit_body.${name}`)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Body"),
        new ButtonBuilder()
          .setCustomId(`u-embed_edit_a&f.${name}`)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Author & Footer"),
      );

      return interaction.editReply({ embeds: [editEmbed], components: [row] });
    }
  }
}
