const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const group = require("../modules/group");
const userModel = require("../modules/user");
//Passport midlleware
app.use(passport.initialize());

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
        console.log(users);
        userModel.User.findOne({ email: user }).then((result) => {
          const newGroup = group({ groupName, createdBy: result._id });

          newGroup.invitedMembers = users;
          group.findOne({ groupName: groupName }).then((group) => {
            if (group) {
              res.status(409).json({ message: "group already exists" });
            } else {
              newGroup.save().then((group) => {
                // res.status(200).json({ message: "group added successfully" });
                console.log(group._id);
                console.log(users);
                const invite = new userModel.Invite({ groupId: group._id });
                console.log(invite);

                userModel.User.where("_id")
                  .in(users)
                  .updateMany(
                    { $push: { groupInvitedTo: group._id } },
                    (err, result) => {
                      console.log(user);
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

module.exports = router;
