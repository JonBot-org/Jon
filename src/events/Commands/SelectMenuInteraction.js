const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
} = require("discord.js");
const logging = require("../../db/logging");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,
};

/**
 * @param {import('discord.js').Interaction} interaction
 */
module.exports.execute = async (interaction) => {
  const { client } = interaction;
  if (interaction.isStringSelectMenu()) {
    // About
    if (interaction.customId === "ab-commands.category") {
      if (interaction.values[0] === "set") {
        const command = client.applicationCommands.filter(value => value.data.name === "set").get('set');
        const commands = command.data.options.map((value) => {
          return `» **Name:** ${value.name}\n» **Description:** ${value.description}`
        }).join('\n\n');

        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`${commands}`)
        .setColor('LuminousVividPink')
        .setTimestamp();

        return interaction.update({ embeds: [embed] })
      } else if (interaction.values[0] === "test") {
        const command = client.applicationCommands.filter(value => value.data.name === "test").get('test');
        const commands = command.data.options.map((value) => {
          return `» **Name:** ${value.name}\n» **Description:** ${value.description}`;
        }).join('\n\n');

        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`${commands}`)
        .setColor('LuminousVividPink')
        .setTimestamp();

        return interaction.update({ embeds: [embed] });
      }
    }

    // Logging
    if (interaction.customId === "logging-type") {
      if (
        !interaction.user.id === interaction?.message?.interaction?.user?.id
      ) {
        const noPermissionEmbed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `**This select menu belongs to \`${interaction.message.interaction.user.username}\`**`,
          )
          .setColor("Orange")
          .setTimestamp();
        return interaction.reply({
          embeds: [noPermissionEmbed],
          ephemeral: true,
        });
      }

      if (interaction.values[0] === "channel") {
        await interaction.deferUpdate();
        const data = await logging.findOne({ id: interaction.guildId });
        if (data && data.channel_config.enabled) {
          const alreadyEnabledEmbed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `${data.channel_config.cid ? `You already have channel event logging enabled in <#${data.channel_config.cid}>` : `Configure channel event logging.`}\n» **Do you want to update the channel?**\n   » Select a channel using the select menu.\n» **Want to disable channel event logging?**\n   » Click the "Disable" button.`,
            )
            .setColor("LuminousVividPink")
            .setTimestamp();

          const EnabledSelectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId("logging-channel.cs")
              .setPlaceholder("Select The Channel To Configure")
              .setMaxValues(1)
              .setChannelTypes([ChannelType.GuildText]),
          );
          const EnabledDButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("logging-channel.disable")
              .setLabel("Disable")
              .setStyle(ButtonStyle.Danger),
          );

          interaction.editReply({
            embeds: [alreadyEnabledEmbed],
            components: [EnabledSelectMenu, EnabledDButton],
          });
        } else {
          const editEmbed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `*Select a channel you want using the select menu.*`,
            )
            .setColor("LuminousVividPink")
            .setTimestamp();

          const editComponents = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId("logging-channel.cs")
              .setPlaceholder("Select The Channel To Configure.")
              .setMaxValues(1)
              .setChannelTypes([ChannelType.GuildText]),
          );

          interaction.editReply({
            embeds: [editEmbed],
            components: [editComponents],
          });
        }
      } else if (interaction.values[0] === "message") {
        await interaction.deferUpdate();
        const data = await logging.findOne({ id: interaction.guildId });
        if (data && data.message_config.enabled) {
          const alreadyEnabledEmbed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `${data.message_config.cid ? `You already have message event logging enabled in <#${data.message_config.cid}>` : `Comfigure message event logging.`}\n» **Do you want to update the channel?**\n   » Select a channel using the select menu.\n» **Want to disable message event logging?**\n   » Click the "Disable" button.`,
            )
            .setColor("LuminousVividPink")
            .setTimestamp();
          const selectMenu = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("logging-message.disable")
              .setLabel("Disable")
              .setStyle(ButtonStyle.Danger),
          );

          const disableButton = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId("logging-message.cs")
              .setMinValues(1)
              .setPlaceholder("Select A Channel To Configure.")
              .addChannelTypes([ChannelType.GuildText]),
          );
          return interaction.editReply({
            embeds: [alreadyEnabledEmbed],
            components: [selectMenu, disableButton],
          });
        } else {
          const newConfigEmbed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
              `*Select a channel you want using the select menu.*`,
            )
            .setColor("LuminousVividPink")
            .setTimestamp();

          const selectMenu = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId("logging-message.cs")
              .setMinValues(1)
              .setPlaceholder("Select A Channel To Configure.")
              .addChannelTypes([ChannelType.GuildText]),
          );

          interaction.editReply({
            embeds: [newConfigEmbed],
            components: [selectMenu],
          });
        }
      }
    }
  } else if (interaction.isChannelSelectMenu()) {
    if (!interaction.user.id === interaction.message.interaction.user.id) {
      const noPermissionEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `**This select menu belongs to \`${interaction.message.interaction.user.username}\`**`,
        )
        .setColor("Orange")
        .setTimestamp();
      return interaction.reply({ embeds: [noPermissionEmbed] });
    }

    if (interaction.customId === "logging-channel.cs") {
      await interaction.deferUpdate();
      const data = await logging.findOne({ id: interaction.guildId });

      if (data) {
        data.channel_config.enabled = true;
        data.channel_config.cid = interaction.values[0];
        await data.save();
      } else {
        await logging.create({
          id: interaction.guildId,
          channel_config: {
            enabled: true,
            cid: interaction.values[0],
          },
        });
      }

      const completeConfigureEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Enabled channel events. \`channel:\` <#${interaction.values[0]}>`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      interaction.editReply({
        embeds: [completeConfigureEmbed],
        components: [],
      });
    } else if (interaction.customId === "logging-message.cs") {
      await interaction.deferUpdate();
      const data = await logging.findOne({ id: interaction.guildId });

      if (data) {
        data.message_config.enabled = true;
        data.message_config.cid = interaction.values[0];
        await data.save();
      } else {
        await logging.create({
          id: interaction.guildId,
          message_config: {
            enabled: true,
            cid: interaction.values[0],
          },
        });
      }

      const completeEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Enabled message events. \`channel:\` <#${interaction.values[0]}>`,
        )
        .setColor("LuminousVividPink")
        .setTimestamp();

      interaction.editReply({ embeds: [completeEmbed], components: [] });
    }
  }
};
