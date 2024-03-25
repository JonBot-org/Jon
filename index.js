require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Handlers } = require("./helpers/handlers");
const { Database } = require("./mongoose");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Handlers.
Database.connect();
Handlers.events(client);
Handlers.commands(client);

client.login(process.env.DISCORD_TOKEN);
