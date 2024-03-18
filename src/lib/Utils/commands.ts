import { ChatInputCommandInteraction } from "discord.js";
import { SubCommandFunctionR } from "../index.m";

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
        `../../Sub-commands/${int.commandName}/${int.options.getSubcommandGroup()}/${int.options.getSubcommand()}`
      );
      file.run(int);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
