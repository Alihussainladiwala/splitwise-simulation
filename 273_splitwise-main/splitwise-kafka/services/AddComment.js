var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");
const note = require("../modules/notes");

const getIdFromEmail = (email) => {
  return new Promise((resolve, reject) => {
    userModel.User.find({ email }).then((result) => {
      console.log(result);
      if (result) {
        resolve(result[0]._id);
      }
    });
  });
};

function handle_request(msg, callback) {
  getIdFromEmail(msg.email).then((id) => {
    console.log(msg, "myMessage");
    console.log(id, "got the id");
    const newNote = new note({ note: msg.note, userId: id });
    bill
      .update({ _id: msg.billId }, { $push: { notes: newNote } })
      .then((result) => {
        // res.status(200).json({ message: "successfully added note" });
        callback(null, { message: "successfully added note" });
      });
  });
}

exports.handle_request = handle_request;
