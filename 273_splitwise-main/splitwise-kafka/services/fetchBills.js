var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");

function handle_request(msg, callback) {
  groupModel.find({ groupName: msg.group }).then((groupData) => {
    console.log(groupData);
    bill.find({ groupName: groupData[0]._id }).then((bills) => {
      //   res.status(200).json(bills);

      //   let res = { message: "successfully added bill" };
      callback(null, bills);
    });
  });
}

exports.handle_request = handle_request;
