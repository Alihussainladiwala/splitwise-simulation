const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  groupName: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  notes: [{ type: Schema.Types.ObjectId, ref: "Note", default: [] }],
});

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;
