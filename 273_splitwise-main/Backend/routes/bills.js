const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const groupModel = require("../modules/group");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const note = require("../modules/notes");
var kafka = require("../kafka/client");
const { Route53Resolver } = require("aws-sdk");
const mongoose = require("mongoose");

//Passport midlleware
app.use(passport.initialize());

//passport config
require("../config/passport")(passport);

router.post(
  "/addBill",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { user, billData, amount, group } = req.body;
    kafka.make_request("bills", req.body, function (err, results) {
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "System Error, Try Again.",
        });
      } else {
        res.send(JSON.stringify(results));
      }
    });
  }
);

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

router.post(
  "/addNotes",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body.note);
    kafka.make_request("addNote", req.body, function (err, results) {
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "System Error, Try Again.",
        });
      } else {
        res.status(200).json(results);
      }
    });

    // getIdFromEmail(req.body.email).then((id) => {
    //   console.log(id, "got the id");
    //   const newNote = new note({ note: req.body.note, userId: id });
    //   bill
    //     .update({ _id: req.params.billId }, { $push: { notes: newNote } })
    //     .then((result) => {
    //       res.status(200).json({ message: "successfully added note" });
    //     });
    // });
  }
);

// router.get(
//   "/fetchNotes/:billId",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     bill.find({_id: req.params.billId}).then(())
//   }
// );

router.post(
  "/deleteNote/:billId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params.billId, req.body.noteId);
    bill
      .updateOne(
        { _id: mongoose.Types.ObjectId(req.params.billId) },
        {
          $pull: { notes: { _id: mongoose.Types.ObjectId(req.body.noteId) } },
        }
      )
      .then((result) => {
        console.log(result);
        if (result) {
          res.status(200).json({ message: "sucessfully deleted note" });
        }
      });
  }
);

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

router.get(
  "/fetchBills/:group",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    kafka.make_request("fetchBills", req.params, function (err, results) {
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "System Error, Try Again.",
        });
      } else {
        res.status(200).json(results);
      }
    });
    // groupModel.find({ groupName: req.params.group }).then((groupData) => {
    //   console.log(groupData);
    //   bill.find({ groupName: groupData[0]._id }).then(async (bills) => {
    //     // let newBills = bills.map((bill) => {
    //     //   return bill.notes.map(async (note) => {
    //     //     note.username = "";
    //     //     note.username = await getUsernameFromID(note.userId);

    //     //     console.log(note.username, "note");
    //     //     // note.username = "Ali";
    //     //   });
    //     // });

    //     for (let i = 0; i < bills.length; i++) {
    //       for (let j = 0; j < bills[i].notes.length; j++) {
    //         bills[i].notes[j].username = await getUsernameFromID(
    //           bills[i].notes[j].userId
    //         );
    //       }
    //     }
    //     res.status(200).json(bills);
    //   });
    // });
  }
);

module.exports = router;
