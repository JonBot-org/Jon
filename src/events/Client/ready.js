const { REST, Routes } = require("discord.js");
const { log } = require("../../utils");

module.exports = {
  name: "ready",
  type: "client",
  /**
   * @param {import('discord.js').Client} client
   */
  run: (client) => {
    if (client.user.id === "1188538997786546287") {
      process.env.NODE_ENV = "production";
    } else {
      process.env.NODE_ENV = "development";
    }

    deploy(client);

    log("i", `${client.user.username}, is ready!`);
  },
};

async function deploy(client) {
  log("i", "Initializing REST client...");
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: client.commandsArray,
  });
  log("i", `Updated (/) commands.`);
}
