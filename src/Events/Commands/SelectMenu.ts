import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  EmbedBuilder,
  Events,
  Interaction,
  ChannelSelectMenuInteraction,
  StringSelectMenuInteraction,
  ChannelType,
} from "discord.js";
import { EventConfigOptions } from "../../lib/index.m";
import Config from "../../Mongo/Models/Config";
import Guilds from "../../Mongo/Models/Guilds";

export const config: EventConfigOptions = {
  name: Events.InteractionCreate,
  once: false,
};

export async function run(interaction: Interaction) {
  if (interaction.isStringSelectMenu()) {
    const customID = interaction.customId;
    if (customID.split("-")[0] != "sl") return;

    if (customID.split(".")[0] === "sl-status_update") {
      if (interaction.user.id != customID.split(".")[1]) return;
      const value = interaction.values[0];

      if (value.split(".")[0] === "vl-status_enable") {
        return statusEnable(interaction);
      } else if (value.split(".")[0] === "vl-status_disable") {
        await interaction.deferUpdate();
        return statusDisable(interaction);
      }
    }
  } else if (interaction.isChannelSelectMenu()) {
    const customID = interaction.customId;
    if (customID.split("-")[0] != "cl") return;

    if (customID.split(".")[0] === "cl-enable_channel") {
      if (interaction.user.id != customID.split(".")[1]) return;
      await interaction.deferUpdate();
      return handleStatusEnableData(interaction, interaction.values[0]);
    }
  }
}

async function statusDisable(interaction: StringSelectMenuInteraction) {
  const data = await Config.findOne({ id: interaction.guildId });

  if (data && data.greet?.enabled) {
    data.greet.enabled = false;
    data.greet.channel = null;
    await data.save();
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(`**Disabled greet module.**`)
    .setColor("Blurple")
    .setTimestamp();

  return interaction.editReply({ embeds: [embed], components: [] });
}

function statusEnable(interaction: StringSelectMenuInteraction) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(
      `**Enable greet module... \`(1/2)\`**\n> Please choose a channel from the menu below!`,
    )
    .setColor("Blurple")
    .setTimestamp();

  const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
    new ChannelSelectMenuBuilder()
      .addChannelTypes([ChannelType.GuildText])
      .setCustomId(`cl-enable_channel.${interaction.user.id}`)
      .setPlaceholder("Channel"),
  );

  return interaction.update({ embeds: [embed], components: [row] });
}

async function handleStatusEnableData(
  interaction: ChannelSelectMenuInteraction,
  channelID: string,
) {
  console.log(channelID);
  await Config.findOneAndUpdate(
    {
      id: interaction.guildId,
    },
    {
      greet: {
        enabled: true,
        channel: channelID,
      },
    },
    {
      upsert: true,
    },
  );

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(`**Enabled greet module. \`(2/2)\`**\n> Updated settings.`)
    .setColor("Blurple")
    .setTimestamp();

  return interaction.editReply({ embeds: [embed], components: [] });
}
