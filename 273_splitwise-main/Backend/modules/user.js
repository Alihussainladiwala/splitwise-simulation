const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupInviteSchema = new mongoose.Schema({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", default: [] },
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "https://splitwise-bucket-1.s3.us-east-2.amazonaws.com/leo.png",
  },
  currency: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "English",
  },
  timezone: {
    type: String,
    default: "utc",
  },
  group: { type: Array, default: [] },
  groupInvitedTo: [{ type: Schema.Types.ObjectId, ref: "Group", default: [] }],
  phoneNo: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", UserSchema);
const Invite = mongoose.model("Invite", groupInviteSchema);

module.exports = {
  User,
  Invite,
};
