var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");

async function handle_request(msg, callback) {
  let members = await userModel.User.find({ email: msg.email });

  callback(null, members);
}

exports.handle_request = handle_request;
