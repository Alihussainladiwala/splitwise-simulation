const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupPhoto: {
    type: String,
    default: "leo.png",
  },
  bills: {
    type: Array,
    default: [],
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  members: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
