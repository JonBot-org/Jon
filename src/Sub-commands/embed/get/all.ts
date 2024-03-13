import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Embed } from "../../../Mongo/Models/Embed";
 
export async function run(interaction: ChatInputCommandInteraction) {
    const data = await Embed.find({ guild: interaction.guildId });

    if (!data) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`**No data found for this guild. \`(${interaction.guildId})\`**`)
        .setColor('Orange')
        .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }

    const mappedData = data.map((value, index) => {
        return `#${index}: ${value.name}`
    }).join('\n');

    const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setDescription(`**List of embeds belonging to this guild:**\n- #(index): (name)\n\n${mappedData}`)
    .setColor('Blurple')
    .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
}