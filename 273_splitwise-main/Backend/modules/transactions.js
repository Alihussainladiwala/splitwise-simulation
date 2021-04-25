const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
  splitAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reciever: { type: Schema.Types.ObjectId, ref: "User", required: true },
  billId: { type: Schema.Types.ObjectId, ref: "Bill" },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
