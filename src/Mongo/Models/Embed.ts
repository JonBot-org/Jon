import mongoose from "mongoose";

const embed = new mongoose.Schema({
  name: String,
  guild: String,
  user: {
    id: String,
    createdAt: String
  },

  author: Object,
  description: String,
  title: String,
  image: String,
  thumbnail: String,
  timestamp: Boolean,
  footer: Object
})

export const Embed = mongoose.model("embed", embed);
