const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const groupModel = require("../modules/group");
const userModel = require("../modules/user");
const billModel = require("../modules/bills");

//Passport midlleware
app.use(passport.initialize());

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    userModel.User.findById(id).then((user) => {
      console.log(user);
      resolve(user.name);
    });
  });
};

const getBillsFromGroupId = (id) => {
  return new Promise((resolve, reject) => {
    billModel.find({ groupName: id }).then((bill) => {
      console.log(bill);
      resolve(bill);
    });
  });
};

const getGroupNameFromId = (groupId) => {
  return new Promise((resolve, reject) => {
    groupModel.find({ _id: groupId }).then((result) => {
      if (result) {
        console.log(result[0].groupName);
        resolve(result[0].groupName);
      }
    });
  });
};

router.get(
  "/activity/:email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("fetch activity");

    userModel.User.findOne({ email: req.params.email }).then(async (user) => {
      //console.log(user);
      //find groups to which he has accepted invite
      //console.log(user.group);
      let activity = [];
      // user.group.forEach(async (group) => {

      for (let i = 0; i < user.group.length; i++) {
        // console.log(group);

        let groupName = await getGroupNameFromId(user.group[i].groupId);

        let groupData = await groupModel.findById(user.group[i].groupId);
        console.log(groupData);

        let creator = await getUserById(groupData.createdBy);
        console.log(creator);
        activity.push({
          activityType: "creator",
          createdBy: creator,
          groupName: groupName,
          timestamp: groupData.timestamp,
        });

        console.log(groupData.members);
        let mappedMembers = groupData.members.map((member) => member.userId);

        let totalMembers = [...mappedMembers, ...groupData.invitedMembers];
        console.log(totalMembers);
        for (let i = 0; i < totalMembers.length; i++) {
          console.log(totalMembers[i]);
          let invitedMember = await getUserById(totalMembers[i]);

          activity.push({
            activityType: "invited",
            members: invitedMember,
            invitedBy: creator,
            groupName: groupName,
            timestamp: groupData.timestamp,
          });
        }

        for (let i = 0; i < mappedMembers.length; i++) {
          let AcceptedInviteMember = await getUserById(totalMembers[i]);

          activity.push({
            activityType: "acceptedInvite",
            members: AcceptedInviteMember,
            timestamp: groupData.timestamp,
            groupName: groupName,
          });
        }

        // get bills
        let bills = await getBillsFromGroupId(groupData._id);
        console.log(bills);

        for (let i = 0; i < bills.length; i++) {
          let billCreator = await getUserById(bills[i].createdBy);

          activity.push({
            activityType: "Bill",
            createdBy: billCreator,
            amount: bills[i].amount,
            groupName: groupName,
            timestamp: bills[i].timestamp,
          });
        }

        console.log(activity);

        // activity.push({activityType: "invited", invited: })
      }

      res.status(200).json(activity);

      //created the gp

      //ppl invited
      //ppl accepted the invite
      //bills
    });
  }
);

module.exports = router;
