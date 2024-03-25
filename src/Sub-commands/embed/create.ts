import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction,
  InteractionCollector,
} from "discord.js";
import { Embed } from "../../Mongo/Models/Embed";
import { Logger } from "../../lib/index.m";

export async function run(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("name", true);

  if (RegExp(/ +/gm).test(name)) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `**Option: \`name\` is not formatted correctly.**\n> name cannot contain spaces`,
      )
      .setColor("Orange")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  const confirmSTDB = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(
      `**Do you want to continue creating this embed? \`(${name})\`**\n> Creating embeds require the bot to store you're userID & username.`,
    )
    .setColor("Blurple")
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("confirm_yes")
      .setStyle(ButtonStyle.Success)
      .setLabel("Yes"),
    new ButtonBuilder()
      .setCustomId("confirm_no")
      .setStyle(ButtonStyle.Danger)
      .setLabel("No"),
  );

  const message = await interaction.editReply({
    embeds: [confirmSTDB],
    components: [row],
  });

  const collector = message.createMessageComponentCollector({
    filter: (int) => int.user.id === interaction.user.id,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (int) => {
    if (int.customId.split(".")[0] === "confirm_no") {
      interaction
        .deleteReply()
        .catch((reason) => Logger.prototype.error(reason));
    } else if (int.customId.split(".")[0] === "confirm_yes") {
      await createEmbedData(int, name, collector);
    }
  });

  collector.on("end", (c, r) => {
    if (r === "time") {
      void interaction.editReply({
        components: [],
        content: `**Run /embed create again.**`,
      });
    }
  });
}

async function createEmbedData(
  interaction: ButtonInteraction,
  name: string,
  c: InteractionCollector<ButtonInteraction>,
) {
  await interaction.deferUpdate();
  const data = await Embed.findOne({ name });

  if (data) {
    const embedAlreadyExist = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `**Embed name is already in use. \`(${name})\`**\n> Embed names have to be unique.`,
      )
      .setColor("Orange")
      .setTimestamp();

    interaction.editReply({ embeds: [embedAlreadyExist] });
    return c.stop();
  } else {
    await Embed.create({
      name: name,
      guild: interaction.guildId,
      user: {
        id: interaction.user.id,
        createdAt: `${Date.now()}`,
      },

      author: { name: "{username}", iconURL: "{useravatar}" },
      title: "{username}",
      timestamp: true,
      footer: { text: "Template Embed" },
    });
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(
      `**Created an embed with a template \`(${name})\`**\n> To edit this embed use \`/embed edit name:${name}\``,
    )
    .setColor("Blurple")
    .setTimestamp();

  interaction.editReply({ embeds: [embed], components: [] });
  void c.stop();
}
