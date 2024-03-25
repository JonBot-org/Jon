const { default: mongoose } = require("mongoose");
const { Utils } = require("../helpers/utils");
const guilds = require("./schema/guilds");

module.exports.Database = {
  connect: () => {
    Utils.write.info("Connecting to database...");
    mongoose.connect(process.env.MONGO_URI);
    Utils.write.info("Succesfully connected to MongoDB.");
  },

  helpers: {
    guilds: {
      createDataIfNotFound: async (guildId) => {
        const data = await guilds.findOne({ guildId });
        if (data) {
          return data;
        } else {
          return await guilds.create({
            guildId: guildId,
          });
        }
      },
    },
  },
};
