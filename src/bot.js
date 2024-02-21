require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Logger } = require("jon-lib");
const {
  handleCommands,
  handleEvents,
  connectMongoDB,
} = require("./lib/functions");
const process = require("node:process");
const mongoose = require("mongoose");
const logger = new Logger();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: { repliedUser: false },
});

client.applicationCommands = new Collection();
client.commands = new Collection();

handleEvents(client);
handleCommands(client);
connectMongoDB();
client.login(process.env.DISCORD_TOKEN);
