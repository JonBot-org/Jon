// Sore user created embed data.
const { default: mongoose } = require("mongoose");

module.exports = mongoose.model(
  "embed",
  new mongoose.Schema({
    name: String,
    authorId: String,
    createdTime: String,
    guildId: String,

    author: {
      name: String,
      iconURL: String,
    },

    footer: {
      text: String,
      iconURL: String,
    },

    description: String,
    image: String,
    thumbnail: String,
  }),
  "embeds",
);
