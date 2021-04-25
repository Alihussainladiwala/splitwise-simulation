const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const groupModel = require("../modules/group");
const userModel = require("../modules/user");
const billModel = require("../modules/bills");
var kafka = require("../kafka/client");

//Passport midlleware
app.use(passport.initialize());

router.get(
  "/activity/:email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("fetch activity");

    kafka.make_request("getActivity", req.params, function (err, results) {
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
  }
);

module.exports = router;
