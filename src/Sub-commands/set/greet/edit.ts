import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Embed } from "../../../Mongo/Models/Embed";
import Config from "../../../Mongo/Models/Config";

export async function run(interaction: ChatInputCommandInteraction) {
  const content = interaction.options.getString("message");
  const name = interaction.options.getString("embed");
  let embedd;
  let embeddata;

  if (!content && !name) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**You have to provide a option.**`)
      .setColor("Orange")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  const data = await Config.findOne({ id: interaction.guildId });
  if (!data || !data.greet?.enabled) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**Greet module is disabled in this server.**`)
      .setColor("Orange")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  if (name) embeddata = await Embed.find({ guild: interaction.guildId });
  if (name) embedd = embeddata?.find((v) => v.name === name);
  if (name && !embedd) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`I can't find a embed with the given name. \`(${name})\``)
      .setColor("Orange")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  data.greet.content = content ? content : null;
  data.greet.embed = name ? name : null;
  await data.save();

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(`**Edited greet settings.**`)
    .setColor("Blurple")
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
}
