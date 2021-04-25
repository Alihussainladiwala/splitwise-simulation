const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserInviteSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: [],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const UserInvite = mongoose.model("UserInvite", UserInviteSchema);

module.exports = {
  UserInvite,
};
