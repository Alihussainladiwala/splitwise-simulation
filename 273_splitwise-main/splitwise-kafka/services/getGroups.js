var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const group = require("../modules/group");

function handle_request(msg, callback) {
  userModel.User.find({ email: msg.email }).then(async (result) => {
    console.log(result);
    console.log(result[0].group);
    let displayResult = [];
    for (let i = 0; i < result[0].group.length; i++) {
      console.log(result[0].group[i].groupId);
      let groupData = await group.findById(result[0].group[i].groupId);
      let groupObj = {
        groupName: groupData.groupName,
        photo: groupData.groupPhoto,
      };

      displayResult.push(groupObj);
    }
    // res.status(200).json(displayResult);
    //let res = { message: "successfully added bill" };
    callback(null, displayResult);
  });
}

exports.handle_request = handle_request;
