const { Events, Client } = require("discord.js");
const { Utils } = require("../helpers/utils");
const { Handlers } = require("../helpers/handlers");
const { Database } = require("../mongoose");

module.exports = {
  name: Events.ClientReady,
  /**
   * @param {Client} client
   */
  run: async (client) => {
    Utils.write.info(`${client.user.username} is online!`);
    Handlers.rest.deploy(client);
  },
};
