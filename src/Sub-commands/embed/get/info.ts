import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Embed } from "../../../Mongo/Models/Embed";

export async function run(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("name", true);
  const data = await Embed.find({ guild: interaction.guildId });

  if (data) {
    const embed = data.find((v) => v.name === name);
    if (embed) {
      const Cembed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `: Name > ${embed.name}\n: Created By > <@${embed.user?.id}>\n: Created At > ${embed.user?.createdAt}`,
        )
        .setColor("Blurple")
        .setTimestamp();

      return interaction.editReply({ embeds: [Cembed] });
    } else {
      const Eembed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `**I coudn't find a embed with that name for this guild. \`(${name}\`**`,
        )
        .setColor("Orange")
        .setTimestamp();

      return interaction.editReply({ embeds: [Eembed] });
    }
  } else {
    const Eembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**I can't find a embed for this guild.**`)
      .setColor("Orange")
      .setTimestamp();

    return interaction.editReply({ embeds: [Eembed] });
  }
}
