import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { SubCommandFunctionR } from "../index.m";
import { Embed } from "../../Mongo/Models/Embed";

export async function HandleGreetModule(member: GuildMember, data: any) {
  const content = data.content ? data.content : null;
  const name = data.embed ? data.embed : null;
  let embed;
  if (name != null)
    embed = (await Embed.find({ guild: member.guild.id })).find(
      (v) => v.name === name,
    );
  if (name && !embed) embed = null;

  const channel = await member.guild.channels
    .fetch(data.channel)
    .catch(console.error);

  if (channel && channel.isTextBased()) {
    const SendPayload = { content: content };
    if (embed) {
      const builder = new EmbedBuilder();

      if (embed.author && embed.author.name) {
        builder.setAuthor({ name: embed.author.name });
        if (embed.author.iconURL) {
          builder.setAuthor({
            name: embed.author.name,
            iconURL: embed.author.iconURL,
          });
        }
      }

      if (embed.title && embed.title.length > 1) {
        builder.setTitle(embed.title);
      }

      if (embed.description && embed.description.length > 1) {
        builder.setDescription(embed.description);
      }

      if (embed.image && embed.image.length > 1) {
        builder.setImage(embed.image);
      }

      if (embed.thumbnail && embed.thumbnail.length > 1) {
        builder.setThumbnail(embed.thumbnail);
      }

      if (embed.timestamp) {
        builder.setTimestamp();
      }

      if (embed.footer) {
        builder.setFooter({ text: embed.footer.text });
        if (embed.footer.iconURL) {
          builder.setFooter({
            text: embed.footer.text,
            iconURL: embed.footer.iconURL,
          });
        }
      }

      Object.assign(SendPayload, { embeds: [builder] });
    }

    channel.send(SendPayload).catch(console.error);
  }
}

export async function handleSubcommands(
  int: ChatInputCommandInteraction,
): Promise<SubCommandFunctionR> {
  if (!int.options.getSubcommandGroup()) {
    try {
      const file = await import(
        `../../Sub-commands/${int.commandName}/${int.options.getSubcommand()}`
      );
      file.run(int);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  } else {
    try {
      const file = await import(
        `../../Sub-commands/${
          int.commandName
        }/${int.options.getSubcommandGroup()}/${int.options.getSubcommand()}`
      );
      file.run(int);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
