import {
  ChatInputCommandInteraction,
  ClientEvents,
  ContextMenuCommandBuilder,
  Guild,
  Message,
  MessageContextMenuCommandInteraction,
  PermissionsString,
  SlashCommandBuilder,
  User,
  UserContextMenuCommandInteraction,
} from "discord.js";

export interface EventConfigOptions {
  name: keyof ClientEvents | string;
  once?: boolean;
}

export interface MessageRunOptions {
  args: string[];
}

export interface CommandOptions {
  message: {
    enabled: boolean;
    permissions?: PermissionsString[];
    guildOnly?: boolean;
  };
  application: {
    enabled: boolean;
    data?: SlashCommandBuilder | ContextMenuCommandBuilder | unknown;
  };
  messageRun?: (message: Message, { args }: MessageRunOptions) => unknown;
  chatInputRun?: (interaction: ChatInputCommandInteraction) => unknown;
  contextMenuRun?: (
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction,
  ) => unknown;
}

export interface SubCommandFunctionR {
  success: boolean;
  error?: Error | unknown;
}

export interface VariablesFunction {
  user: User;
  guild: Guild;
}

export * from "./Utils/time";
export * from "./Utils/embed";
export * from "./Utils/Logger";
export * from "./Utils/commands";
export * from "./Client/Jon";
