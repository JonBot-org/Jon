import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _i: String,
  buttonsClicked: Number,
  commandsExecuted: Number,
});

export const Bot = mongoose.model("bot", schema);
