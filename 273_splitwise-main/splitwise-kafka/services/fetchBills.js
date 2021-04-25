var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");

const getUsernameFromID = (userId) => {
  return new Promise((resolve, reject) => {
    {
      userModel.User.findById(userId).then((user) => {
        // console.log(user.name);
        resolve(user.name);
      });
    }
  });
};

function handle_request(msg, callback) {
  groupModel.find({ groupName: msg.group }).then((groupData) => {
    bill.find({ groupName: groupData[0]._id }).then(async (bills) => {
      // let newBills = bills.map((bill) => {
      //   return bill.notes.map(async (note) => {
      //     note.username = "";
      //     note.username = await getUsernameFromID(note.userId);

      //     console.log(note.username, "note");
      //     // note.username = "Ali";
      //   });
      // });

      for (let i = 0; i < bills.length; i++) {
        let creator = await getUsernameFromID(bills[i].createdBy);
        bills[i].createdByName = creator;

        for (let j = 0; j < bills[i].notes.length; j++) {
          bills[i].notes[j].username = await getUsernameFromID(
            bills[i].notes[j].userId
          );
        }
      }
      callback(null, bills);
    });
  });
}

exports.handle_request = handle_request;
