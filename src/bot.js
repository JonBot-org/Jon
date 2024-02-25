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

handleEvents(client);
handleCommands(client);
connectMongoDB();
client.login(process.env.DISCORD_TOKEN);
