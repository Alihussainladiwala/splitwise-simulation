var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");

function handle_request(msg, callback) {
  userModel.User.findOne({ email: msg.user }).then((user) => {
    if (user) {
      groupModel.findOne({ groupName: msg.group }).then((group) => {
        const newBill = new bill({
          amount: msg.amount,
          description: msg.billData,
          createdBy: user._id,
          groupName: group._id,
        });

        newBill.save().then((bill) => {
          groupModel
            .update({ groupName: msg.group }, { $push: { bills: bill._id } })
            .then((billM) => {});

          let members = group.members.map((member) => member.userId);

          let allMembers = [...members, group.createdBy];

          splitAmount = msg.amount / allMembers.length;

          allMembers.forEach((member) => {
            console.log(typeof JSON.stringify(member));
            if (JSON.stringify(member) !== JSON.stringify(user._id)) {
              const newTransaction = new transactions({
                splitAmount,
                sender: user._id,
                reciever: member,
                billId: bill._id,
              });
              newTransaction.save();
            }
          });
        });
      });
    }
  });

  //   res.status(200).json({ message: "successfully added bill" });
  let res = { message: "successfully added bill" };
  callback(null, res);
}

exports.handle_request = handle_request;
