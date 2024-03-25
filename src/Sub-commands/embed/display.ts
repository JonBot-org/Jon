import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Embed } from "../../Mongo/Models/Embed";

export async function run(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("name");

  if (name) {
    const data = await Embed.findOne({ name: name });
    if (!data) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`**I can't find a embed with this name \`${name}\`**`)
        .setColor("Orange")
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `\`+\` **Name:** ${data.name}\n\`+\` **Author:** <@${data.user?.id}>\n\`+\` **Created At:** ${data.user?.createdAt ? `<t:${data.user.createdAt}:>` : "null"}`,
      )
      .setColor("Blurple")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
}
