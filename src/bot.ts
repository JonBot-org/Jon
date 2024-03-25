import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { JonBot } from "./lib/index.m";

// Config dotenv.
import { configDotenv } from "dotenv";
configDotenv();

// Create the client.
const client = new JonBot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
  shards: "auto",
  presence: {
    status: "dnd",
    activities: [
      {
        name: "Meow!",
        type: ActivityType.Playing,
      },
    ],
  },
});

process.on(
  "uncaughtException",
  (error: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
    client.logger.error(error, 1);
  },
);

process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    client.logger.error(reason, 1);
  },
);

// Login to Discord.
client.login();
