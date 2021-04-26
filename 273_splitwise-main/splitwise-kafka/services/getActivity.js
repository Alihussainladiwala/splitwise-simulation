var mongo = require("./mongoose");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");
const groupModel = require("../modules/group");
const billModel = require("../modules/bills");

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    userModel.User.findById(id).then((user) => {
      resolve(user.name);
    });
  });
};

const getBillsFromGroupId = (id) => {
  return new Promise((resolve, reject) => {
    billModel.find({ groupName: id }).then((bill) => {
      resolve(bill);
    });
  });
};

const getGroupNameFromId = (groupId) => {
  return new Promise((resolve, reject) => {
    groupModel.find({ _id: groupId }).then((result) => {
      if (result) {
        resolve(result[0].groupName);
      }
    });
  });
};

function handle_request(msg, callback) {
  userModel.User.findOne({ email: msg.email }).then(async (user) => {
    //console.log(user);
    //find groups to which he has accepted invite
    //console.log(user.group);
    let activity = [];
    // user.group.forEach(async (group) => {

    for (let i = 0; i < user.group.length; i++) {
      let groupName = await getGroupNameFromId(user.group[i].groupId);

      let groupData = await groupModel.findById(user.group[i].groupId);

      let creator = await getUserById(groupData.createdBy);
      activity.push({
        activityType: "creator",
        createdBy: creator,
        groupName: groupName,
        timestamp: groupData.timestamp,
      });

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

    callback(null, activity);

    //created the gp

    //ppl invited
    //ppl accepted the invite
    //bills
  });
}

exports.handle_request = handle_request;
