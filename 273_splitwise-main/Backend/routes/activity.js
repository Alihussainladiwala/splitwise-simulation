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

router.get(
  "/activity/:email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("fetch activity");

    userModel.User.findOne({ email: req.params.email }).then((user) => {
      //console.log(user);
      //find groups to which he has accepted invite
      //console.log(user.group);
      let activity = [];
      user.group.forEach((group) => {
        // console.log(group);
        groupModel.findById(group.groupId).then(async (groupData) => {
          console.log(groupData);

          let creator = await getUserById(groupData.createdBy);
          console.log(creator);
          activity.push({
            activityType: "creator",
            createdBy: creator,
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
              timestamp: groupData.timestamp,
            });
          }

          for (let i = 0; i < mappedMembers.length; i++) {
            let AcceptedInviteMember = await getUserById(totalMembers[i]);

            activity.push({
              activityType: "acceptedInvite",
              members: AcceptedInviteMember,
              timestamp: groupData.timestamp,
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
              timestamp: bills[i].timestamp,
            });
          }

          console.log(activity);

          // activity.push({activityType: "invited", invited: })
        });
      });

      //created the gp

      //ppl invited
      //ppl accepted the invite
      //bills
    });

    res.status(200).json({ message: "got activity" });
  }
);

module.exports = router;
