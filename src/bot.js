require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const {
  handleCommands,
  handleEvents,
  connectMongoDB,
} = require("./lib/functions");
const process = require("node:process");
const logger = require("jon-lib").Logger;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  allowedMentions: { repliedUser: false },
  partials: [Partials.Message, Partials.Channel],
});

client.applicationCommands = new Collection();
client.commands = new Collection();

process.on("uncaughtException", (error, origin) => {
  console.error(origin, error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(reason, promise);
});

handleEvents(client);
handleCommands(client);
connectMongoDB();
client.login(process.env.DISCORD_TOKEN);
