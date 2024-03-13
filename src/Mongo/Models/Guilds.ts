import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: String,
  tos: Boolean,
});

export default mongoose.model("guild", schema);
