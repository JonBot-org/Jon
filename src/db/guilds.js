const { default: mongoose, Schema } = require("mongoose");

module.exports = mongoose.model(
  "guild",
  new Schema({
    id: String,
    ownerId: String,

    configurations: {
      greet: {
        enabled: { type: Boolean, default: false },
        channel: String,
        message: String,
        description: String,
        title: String,
        author_name: String,
        author_icon: String,
        color: String,
        timestamp: String,
      },

      leave: {
        enabled: { type: Boolean, default: false },
        channel: String,
        message: String,
        description: String,
        title: String,
        author_name: String,
        author_icon: String,
        color: String,
        timestamp: String,
      },
    },
  }),
);
