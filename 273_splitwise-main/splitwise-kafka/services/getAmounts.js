var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");
const mongoose = require("mongoose");
const transaction = require("../modules/transactions");

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
        resolve(result);
      }
    );
  });
};

const getNameFromId = (friend) => {
  return new Promise((resolve, reject) => {
    userModel.User.findOne({ _id: friend }).then((user) => {
      resolve(user.name);
    });
  });
};

const getEmailFromId = (friend) => {
  return new Promise((resolve, reject) => {
    userModel.User.findOne({ _id: friend }).then((user) => {
      resolve(user.email);
    });
  });
};

getGroupIdFromName = (groupName) => {
  return new Promise((resolve, reject) => {
    groupModel.find({ groupName }).then((result) => {
      if (result) {
        resolve(result[0]._id);
      }
    });
  });
};

const getFriendsGroup = (user, group) => {
  return new Promise(async (resolve, reject) => {
    var friends = [];

    let groupData = await groupModel.findById(groupId);
    let members = groupData.members.map((member) => member.userId);
    friends.push(...members);
    friends.push(groupData.createdBy);

    friends1 = friends.map((friend) => JSON.stringify(friend));
    let uniqueFriends = [...new Set(friends1)];
    uniqueFriends = uniqueFriends.map((friend) => {
      return mongoose.Types.ObjectId(JSON.parse(friend));
    });

    // console.log(uniqueFriends);
    resolve(uniqueFriends);
  });
};

const getFriends = (user) => {
  return new Promise(async (resolve, reject) => {
    var friends = [];
    for (let i = 0; i < user.group.length; i++) {
      let groupData = await groupModel.findById(user.group[i].groupId);
      let members = groupData.members.map((member) => member.userId);
      friends.push(...members);
      friends.push(groupData.createdBy);
    }
    friends1 = friends.map((friend) => JSON.stringify(friend));
    let uniqueFriends = [...new Set(friends1)];
    uniqueFriends = uniqueFriends.map((friend) => {
      return mongoose.Types.ObjectId(JSON.parse(friend));
    });

    resolve(uniqueFriends);
  });
};

function handle_request(msg, callback) {
  userModel.User.findOne({ email: msg.user }).then(async (user) => {
    let friends = [];
    friends = await getFriends(user);
    let transactions = [];
    for (let i = 0; i < friends.length; i++) {
      let sent = await getTransactions(user._id, friends[i]);
      let recieved = await getTransactions(friends[i], user._id);
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

      let friendName = await getNameFromId(friends[i]);
      let friendEmail = await getEmailFromId(friends[i]);

      let transactionObj = {
        name: friendName,
        amount: sentAmount - recievedAmount,
        email: friendEmail,
      };
      transactions.push(transactionObj);
    }

    callback(null, transactions);
  });
}

exports.handle_request = handle_request;
