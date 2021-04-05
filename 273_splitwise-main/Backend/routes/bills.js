const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const groupModel = require("../modules/group");
const bill = require("../modules/bills");
const userModel = require("../modules/user");
const transactions = require("../modules/transactions");

//Passport midlleware
app.use(passport.initialize());

//passport config
require("../config/passport")(passport);

router.post(
  "/addBill",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { user, billData, amount, group } = req.body;

    userModel.User.findOne({ email: user }).then((user) => {
      if (user) {
        console.log(user);
        groupModel.findOne({ groupName: group }).then((group) => {
          console.log(group);

          const newBill = new bill({
            amount,
            description: billData,
            createdBy: user._id,
            groupName: group._id,
          });

          newBill.save().then((bill) => {
            console.log(bill);

            splitAmount = amount / group.members.length;

            group.members.forEach((member) => {
              console.log(typeof JSON.stringify(member));
              if (JSON.stringify(member) !== JSON.stringify(user._id)) {
                const newTransaction = new transactions({
                  splitAmount,
                  sender: user._id,
                  reciever: member,
                  billId: bill._id,
                });
                newTransaction.save();
              }
            });
          });
        });
      }
    });

    res.status(200).json({ message: "successfully added bill" });
  }
);

module.exports = router;
