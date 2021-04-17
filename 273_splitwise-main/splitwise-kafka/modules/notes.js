const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notes = new mongoose.Schema({
  note: {
    type: String,
    required: true,
    default: "",
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
    default: [],
  },
});
