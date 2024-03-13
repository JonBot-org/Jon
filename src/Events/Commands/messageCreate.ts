import { Events, Message, EmbedBuilder } from "discord.js";
import { EventConfigOptions, JonBot } from "../../lib/index.m";

export const config: EventConfigOptions = {
  name: Events.MessageCreate,
  once: false,
};

export function run(message: Message) {
  const client = message.client as JonBot;
  const prefix = "<";

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).split(/ +/gm);

  const command = client.messageCommands.get(args[0]);
  if (!command) return;

  if (command.message.guildOnly && !message.inGuild()) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`:x: | This command can only be used in a server.`)
      .setColor("Orange")
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  if (command.messageRun) {
    command.messageRun(message, { args });
  }
}
