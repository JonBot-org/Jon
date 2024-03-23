import {
  Client,
  ClientOptions,
  Collection,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import fs from "node:fs";
import { CommandOptions, Logger } from "../index.m";
import mongoose from "mongoose";
import { formatPath } from "../Utils/utils";

export class JonBot extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.handleEvents();
    this.connectMongo();
  }

  public applicationCommands = new Collection<string, CommandOptions>();
  public applicationCommandsData: Array<
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | RESTPostAPIContextMenuApplicationCommandsJSONBody
  > = [];
  public messageCommands = new Collection<string, CommandOptions>();
  public logger = new Logger();

  private async connectMongo() {
    try {
      this.logger.info("Connecting To MongoDB.");
      await mongoose.connect(process.env.MONGO_URI!);
      this.logger.info("Connected To MongoDB");
    } catch (error) {
      this.logger.error(error, 1);
    }
  }

  public async handleCommands() {
    for (const file of fs.readdirSync(formatPath('/src/Commands/'))) {
      const object = await import(`../../Commands/${file.split(".")[0]}`);
      const command = object.command;

      if (command.application.enabled && command.application.data) {
        this.applicationCommands.set(command.application.data.name, command);
        this.applicationCommandsData.push(command.application.data.toJSON());
      }

      if (command.message.enabled && command.application.data) {
        this.messageCommands.set(command.application.data.name, command);
      }
    }
   
    this.rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: this.applicationCommandsData,
    });
  }

  public async handleEvents() {
    for (const folder of fs.readdirSync(formatPath('./src/Events/'))) {
      for (const file of fs.readdirSync(formatPath(`./src/Events/${folder}`))) {
        const event = await import(
          `../../Events/${folder}/${file.split(".")[0]}`
        );
        this[event.config.once ? "once" : "on"](event.config.name, (...args) =>
          event.run(...args),
        );
      }
    }
  }
}
