const { isImage, sleep } = require("../../../../../lib/functions");
const {
  Colors,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const guilds = require("../../../../../db/guilds");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */
module.exports = async (interaction, client) => {
  await interaction.deferReply({ fetchReply: true });
  const { guild, options, member } = interaction;

  const message = options.getString("message");
  const description = options.getString("description");
  const title = options.getString("title");
  const author_name = options.getString("author_name");
  const author_icon = options.getString("author_icon");
  const color = options.getString("color");
  const timestamp = options.getBoolean("timestamp");

  const errorEmbed = new EmbedBuilder()
    .setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    })
    .setColor("DarkVividPink")
    .setTimestamp();

  if (!message && !description) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          `Message build failed.\nThe \`message\` or \`description\` option has to be present.\n- **Use </vars:> to see a list of variables you can use.**`,
        ),
      ],
    });
  }

  if (color && !description) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          `Message build failed.\nIf you want to use an embed the \`description\` option is required.`,
        ),
      ],
    });
  }

  if (title && !description) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          `Message build failed.\nIf you want to use an embed the \`description\` option is required`,
        ),
      ],
    });
  }

  if (author_name && !description) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          `Message build failed.\nIf you want to use an embed the \`description\` option is required.`,
        ),
      ],
    });
  }

  if (author_icon && !author_name) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          `Message build failed.\nIf you want to use author_icon you have to use author_name | **author_name is not given.**\n- **Use </vars:> to see a list of variables you can use.**`,
        ),
      ],
    });
  }

  if (
    author_icon &&
    !isImage(author_icon) &&
    !["{user_avatar}", "{server_icon}"].includes(author_icon)
  ) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          "Message build failed.\n`author_icon` is invalid.\n- Valid inputs are: A url, {user_avatar} or {server_icon}",
        ),
      ],
    });
  }

  if (color && !Colors[color]) {
    return interaction.editReply({
      embeds: [
        errorEmbed.setDescription(
          `Message build failed.\n\`color\` option is invalid.\nSee a list of colors you can use [here](https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812)`,
        ),
      ],
    });
  }

  const data = await guilds.findOne({ id: guild.id });

  if (data) {
    data.configurations.leave.message = message ? message : null;
    data.configurations.leave.description = description ? description : null;
    data.configurations.leave.title = title ? title : null;
    data.configurations.leave.author_name = author_name ? author_name : null;
    data.configurations.leave.author_icon = author_icon ? author_icon : null;
    data.configurations.leave.color = color ? color : null;
    data.configurations.leave.timestamp = timestamp ? "YES" : "NO";
    await data.save();

    const completeEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(`Edited the leave module message.`)
      .setColor("LuminousVividPink")
      .setTimestamp();

    return interaction.editReply({ embeds: [completeEmbed] });
  } else {
    const confirmEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(
        `The leave module is disabled in this server.\n- Do you want to enable the leave module?`,
      )
      .setColor("DarkPurple")
      .setTimestamp();

    const confirmRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("leave.edit-yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("leave.edit-no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger),
    );

    const message = await interaction.editReply({
      embeds: [confirmEmbed],
      components: [confirmRow],
    });

    const collector = message.createMessageComponentCollector({
      filter: (int) => int.user.id === interaction.user.username,
      componentType: ComponentType.Button,
      maxComponents: 1,
    });

    collector.on("collect", async (int) => {
      if (int.customId === "leave.edit-no") {
        const cancelEmbed = new EmbedBuilder()
          .setAuthor({
            name: int.user.username,
            iconURL: int.user.displayAvatarURL(),
          })
          .setDescription("Canceled this process.")
          .setColor("LuminousVividPink")
          .setTimestamp();
        int.update({ embeds: [cancelEmbed], components: [] });
        sleep(5000)
          .then(() => int.deleteReply())
          .catch();
        return collector.stop("PS");
      }

      await int.deferUpdate();

      await guilds.create({
        id: guild.id,
        configurations: {
          leave: {
            enabled: true,
            channel: int.channel,
            message: message ? message : null,
            description: description ? description : null,
            title: title ? title : null,
            author_name: author_name ? author_name : null,
            author_icon: author_icon ? author_icon : null,
            color: color ? color : null,
            timestamp: timestamp ? "YES" : "NO",
          },
        },
      });

      const completeEmbed = new EmbedBuilder()
        .setAuthor({
          name: int.user.username,
          iconURL: int.user.displayAvatarURL(),
        })
        .setDescription(
          `Enabled leave module and edited the message. \`channel:\` ${int.channel}\n- To change the leave module channel use </set leaves enable:1209442876090617856>`,
        )
        .setColor(color ? Colors[color] : "DarkPurple")
        .setTimestamp();

      int.editReply({ embeds: [completeEmbed], components: [] });
      return collector.stop("PS");
    });

    collector.on("end", (collected, reason) => {
      if (reason === "PS") return;
      if (reason === "time") {
        interaction.editReply({ components: [] }).catch();
      }
    });
    return;
  }
};
