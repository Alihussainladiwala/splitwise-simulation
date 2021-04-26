var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");
const group = require("../modules/group");

function handle_request(msg, callback) {
  userModel.User.findOne({ email: msg.email }).then((result) => {
    group
      .where("_id")
      .in(result.groupInvitedTo)
      .select("groupName")
      .then((groups) => {
        callback(null, groups);
      });
  });
}

exports.handle_request = handle_request;
