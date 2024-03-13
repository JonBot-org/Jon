import { GatewayIntentBits, Partials } from "discord.js";
import { JonBot } from "./lib/index.m";

// Config dotenv.
import { configDotenv } from "dotenv";
configDotenv();

// Create the client.
const client = new JonBot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
  shards: "auto",
  presence: {
    status: "dnd",
  },
});

// Login to Discord.
client.login();
