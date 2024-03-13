import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import Config from "../../../Mongo/Models/Config";

export async function run(interaction: ChatInputCommandInteraction) {
  const data = await Config.findOne({ id: interaction.guildId });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(
      `**Current greet settings.**\n- **Enabled:** ${(data ? true : false) ? (data?.greet ? true : false) : false}\n- **Channel:** ${data?.greet?.channel ? data.greet.channel : "No channel configured."}`,
    )
    .setColor("Blurple")
    .setTimestamp();

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`sl-status_update.${interaction.user.id}`)
      .setPlaceholder("Update")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Enable")
          .setDescription("Enable the greet module.")
          .setValue("vl-status_enable.{{none}}"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Disable")
          .setDescription("Disable the greet module.")
          .setValue("vl-status_disable.{{none}}"),
      ),
  );

  return interaction.editReply({ embeds: [embed], components: [row] });
}
