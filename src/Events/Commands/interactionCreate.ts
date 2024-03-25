import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  Interaction,
} from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";
import Guilds from "../../Mongo/Models/Guilds";
import { Bot } from "../../Mongo/Models/Bot";

export const config: EventConfigOptions = {
  name: "interactionCreate",
  once: false,
};

export async function run(interaction: Interaction) {
  const client = interaction.client as JonBot;

  if (interaction.isChatInputCommand()) {
    await Bot.findOneAndUpdate(
      {
        _i: process.env.MIP,
      },
      { $inc: { commandsExecuted: 1 } },
      { upsert: true },
    ).catch(console.error);

    const command = client.applicationCommands.get(interaction.commandName);

    if (!command) {
      return;
    }

    const data = await Guilds.findOne({ id: interaction.guildId });

    if (
      interaction.inCachedGuild() &&
      interaction.member.permissions.has("ManageGuild")
    ) {
      if (!data?.tos || !data) {
        const accept_stdb = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(
            `**Hey, \`${interaction.user.username}\`. Before you try some of my commands, please give me permission to store data like \`serverID & channelID(s)\`**\n\n> Do you want to give me permissions to store data in my database? (yes/no)`,
          )
          .setColor("Orange")
          .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`u-accept_stdb_yes.${interaction.guildId}`)
            .setStyle(ButtonStyle.Success)
            .setLabel("Yes"),
          new ButtonBuilder()
            .setCustomId(`u-accept_stdb_no.${interaction.guildId}`)
            .setStyle(ButtonStyle.Danger)
            .setLabel("No"),
        );

        return interaction.reply({
          embeds: [accept_stdb],
          components: [row],
          ephemeral: true,
        });
      }
    }

    if (command.chatInputRun) {
      if (interaction.member instanceof GuildMember) {
        client.emit("guildMemberAdd", interaction.member);
      }
      command.chatInputRun(interaction);
    }
  }
}
