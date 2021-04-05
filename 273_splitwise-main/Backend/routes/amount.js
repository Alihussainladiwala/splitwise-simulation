const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const groupModel = require("../modules/group");
const userModel = require("../modules/user");
const transaction = require("../modules/transactions");
const mongoose = require("mongoose");
//Passport midlleware
app.use(passport.initialize());

//passport config
require("../config/passport")(passport);

const getTransactions = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    transaction.aggregate(
      [
        {
          $match: {
            $and: [
              { sender: mongoose.Types.ObjectId(userId) },
              { reciever: mongoose.Types.ObjectId(friendId) },
            ],
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$splitAmount" },
          },
        },
      ],
      function (err, result) {
        // console.log(err, "hello");
        // console.log(result, "hello");
        resolve(result);
      }
    );
  });
};

const getNameFromId = (friend) => {
  console.log(friend, "inside friend");
  return new Promise((resolve, reject) => {
    userModel.User.findOne({ _id: friend }).then((user) => {
      resolve(user.name);
    });
  });
};

const getFriends = (user) => {
  return new Promise(async (resolve, reject) => {
    var friends = [];
    for (let i = 0; i < user.group.length; i++) {
      let groupData = await groupModel.findById(user.group[i].groupId);
      friends.push(...groupData.members);
    }
    resolve(friends);
  });
};

router.get(
  "/amount/:user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("get transaction amounts");
    console.log(req.params.user);
    userModel.User.findOne({ email: req.params.user }).then(async (user) => {
      let friends = [];
      friends = await getFriends(user);
      //   user.group.forEach((group) => {
      //     console.log(group.groupId);
      // groupModel.findById(group.groupId).then((group) => {
      //   console.log(group);
      //   friends.push(...group.members);
      //   console.log(friends);
      // });
      //   });
      let transactions = [];
      for (let i = 0; i < friends.length; i++) {
        // console.log(user._id);
        // console.log(friends[i]);

        let sent = await getTransactions(user._id, friends[i]);
        let recieved = await getTransactions(friends[i], user._id);
        // console.log(sent);
        // console.log(recieved);
        sentAmount = 0;
        recievedAmount = 0;

        if (sent.length == 0) {
          sentAmount = 0;
        } else {
          sentAmount = sent[0].total;
        }

        if (recieved.length == 0) {
          recievedAmount = 0;
        } else {
          recievedAmount = recieved[0].total;
        }

        // console.log(sentAmount);
        // console.log(recievedAmount);

        let friendName = await getNameFromId(friends[i]);

        // console.log(friendName);

        console.log("###########");

        let transactionObj = {
          name: friendName,
          amount: sentAmount - recievedAmount,
        };
        transactions.push(transactionObj);
      }

      console.log(transactions);
      res.status(200).json(transactions);
    });
  }
);

const getIdFromName = (email) => {
  return new Promise((resolve, reject) => {
    userModel.User.findOne({ email }).then((user) => {
      resolve(user._id);
    });
  });
};

router.post(
  "/settleUp",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body.sender);
    console.log(req.body.reciever);
    // console.log(req.body.amount);

    let sender = await getIdFromName(req.body.sender);
    let reciever = await getIdFromName(req.body.reciever);

    let settleUpTransaction = new transaction({
      splitAmount: req.body.amount,
      sender: sender,
      reciever: reciever,
    });

    settleUpTransaction.save();

    res.status(200).json({ message: "successfully settled up" });
  }
);

module.exports = router;
