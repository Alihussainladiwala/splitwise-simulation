"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const saltrounds = 10;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const groupFunctions = require("./helperfunctionGroups");
const billFunctions = require("./helperfunctionBill");
const activity = require("./helperfunctionActivity");
const moment = require("moment");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const util = require("util");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const routerGp = require("./routes/groups.js");
const routerInvites = require("./routes/invites.js");
const routerBills = require("./routes/bills.js");
const routerAmounts = require("./routes/amount.js");
const routerActivity = require("./routes/activity.js");
const pipeline = util.promisify(require("stream").pipeline);
const AWS = require("aws-sdk");
const stream = require("stream");
const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream } = require("./s3");

const User = require("./modules/user");

//db coonfig mongo
const db = require("./config/keys").MongoURI;

const secret = require("./config/keys").secretOrKey;

mongoose
  .connect(db, { poolSize: 10, useNewUrlParser: true })
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: "true" }));

app.use(routerGp);

app.use(routerInvites);

app.use(routerBills);

app.use(routerAmounts);

app.use(routerActivity);

app.post("/signUp", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
  } else {
    User.User.findOne({ email: email }).then(async (user) => {
      if (user) {
        res.status(400).json({ message: "email aready exists" });
      } else {
        const newUser = new User.User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;

            newUser
              .save()
              .then((user) => {
                res.status(200).json({ message: "user added successfully" });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          });
        });
      }
    });
  }
});

//Passport midlleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(400).json({ message: "user does not exist" });
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = { email: email }; //Create jwt payload
          jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
            res.status(200).json({ success: true, token: "Bearer " + token });
          });
        } else {
          res.status(400).json({ message: "incorrect password" });
        }
      });
    }
  });
});

app.get(
  "/something",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ message: "can access it" });
  }
);

app.listen(3001, () => {
  console.log("server running on 3001");
});

app.post("/upload/:email", upload.single("file"), async function (req, res) {
  const file = req.file;
  console.log(file);

  // apply filter
  // resize

  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;

  User.User.update(
    { email: req.params.email },
    { photo: result.Location }
  ).then((result) => {
    if (result) {
      res.send({ imagePath: `/images/${result.Key}` });
    }
  });
});

module.exports = app;
