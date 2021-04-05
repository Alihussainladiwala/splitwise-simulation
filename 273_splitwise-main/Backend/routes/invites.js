const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const userModel = require("../modules/user");
const group = require("../modules/group");

//Passport midlleware
app.use(passport.initialize());

//passport config
require("../config/passport")(passport);

router.get(
  "/invites/:email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userModel.User.findOne({ email: req.params.email }).then((result) => {
      group
        .where("_id")
        .in(result.groupInvitedTo)
        .select("groupName")
        .then((groups) => {
          res.status(200).json(groups);
        });
    });
  }
);

router.post(
  "/inviteStatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { status, groupName, email } = req.body;

    // get objectid for group
    group.findOne({ groupName }).then((group) => {
      console.log(group._id);
      userModel.User.findOneAndUpdate(
        { email },
        { $pull: { groupInvitedTo: group._id } }
      ).then((result) => {
        const invite = new userModel.Invite({ groupId: group._id });
        userModel.User.findOneAndUpdate(
          { email },
          { $push: { group: invite } }
        ).then((result) => {
          res.status(200).json({ message: "sucessfully accepted invite" });
        });
      });
    });
    // search for that objectId in groupInvited to
    //push that id on to group list along with timestamp
  }
);

module.exports = router;
