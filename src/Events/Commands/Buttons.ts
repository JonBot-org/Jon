import { EmbedBuilder, Events, Interaction } from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";
import Guilds from "../../Mongo/Models/Guilds";

export const config: EventConfigOptions = {
  name: Events.InteractionCreate,
  once: false,
};

export async function run(interaction: Interaction) {
  const client = interaction.client as JonBot;

  if (interaction.isButton()) {
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
      interaction.message.delete().catch();
    }
  }
}
