const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const group = require("../modules/group");
const userModel = require("../modules/user");
//Passport midlleware
app.use(passport.initialize());
const mongoose = require("mongoose");
var kafka = require("../kafka/client");

//passport config
require("../config/passport")(passport);

router.post(
  "/createGroup",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { groupName, user, members } = req.body;
    userModel.User.where("email")
      .in(members)
      .select("_id")
      .then((users) => {
        userModel.User.findOne({ email: user }).then((result) => {
          const newGroup = group({ groupName, createdBy: result._id });

          newGroup.invitedMembers = users;
          group.findOne({ groupName: groupName }).then((group) => {
            if (group) {
              res.status(409).json({ message: "group already exists" });
            } else {
              newGroup.save().then((group) => {
                // res.status(200).json({ message: "group added successfully" });

                const invite = new userModel.Invite({ groupId: group._id });

                userModel.User.where("_id")
                  .in(users)
                  .updateMany(
                    { $push: { groupInvitedTo: group._id } },
                    (err, result) => {
                      if (!err) {
                        userModel.User.findOneAndUpdate(
                          { email: user },
                          { $push: { group: invite } },
                          (err, result) => {
                            if (!err) {
                              res
                                .status(200)
                                .json({ message: "group added successfully" });
                            } else {
                              res
                                .status(400)
                                .json({ message: "failed to add group" });
                            }
                          }
                        );
                      } else {
                        res
                          .status(400)
                          .json({ message: "failed to add group" });
                      }
                    }
                  );
              });
            }
          });
        });
      });
  }
);

router.get(
  "/getGroups/:email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    kafka.make_request("getGroups", req.params, function (err, results) {
      if (err) {
        res.json({
          status: "error",
          msg: "System Error, Try Again.",
        });
      } else {
        res.send(results);
      }
    });
  }
);

router.get(
  "/users/:email",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let userId = await getUserIdFromEmail(req.params.email);
    let members = await userModel.User.find(
      { _id: { $nin: [userId] } },
      { name: 1, email: 1 }
    );

    res.status(200).json(members);
  }
);

router.get(
  "/accountInfo/:email",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let members = await userModel.User.find({ email: req.params.email });

    res.status(200).json(members);
  }
);

router.post(
  "/updateAccountInfo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, name, phoneNo, currency } = req.body;
    let update = await userModel.User.update(
      { email: email },
      { email, name, phoneNo, currency }
    );
    if (update) {
      res.status(200).json({ message: "successfully updated" });
    } else {
      res.status(400).json({ message: "failed to update account info" });
    }
  }
);

router.get(
  "/userId/:email",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    userModel.User.find({ email: req.params.email }).then((result) => {
      if (result) {
        res.status(200).json({ id: result[0]._id });
      }
    });
  }
);

getGroupIdFromName = (groupName) => {
  return new Promise((resolve, reject) => {
    groupModel.find({ groupName }).then((result) => {
      if (result) {
        resolve(result[0]._id);
      }
    });
  });
};

getUserIdFromEmail = (email) => {
  return new Promise((resolve, reject) => {
    userModel.User.find({ email }).then((result) => {
      if (result) {
        resolve(result[0]._id);
      }
    });
  });
};

router.post(
  "/exitGroup/:email/:group",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    userId = await getUserIdFromEmail(req.params.email);
    groupId = await getGroupIdFromName(req.params.group);

    userModel.User.update(
      { _id: userId },
      { $pull: { group: { groupId: mongoose.Types.ObjectId(groupId) } } }
    ).then((result) => {
      if (result) {
        group
          .update(
            { _id: groupId },
            { $pull: { members: { userId: mongoose.Types.ObjectId(userId) } } }
          )
          .then((result) => {
            res.status(200).json({ message: "successfully exited group" });
          });
      }
    });

    // userModel.User.update()
  }
);

module.exports = router;
