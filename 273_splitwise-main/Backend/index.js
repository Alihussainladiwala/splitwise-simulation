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
const fs = require("fs");
const util = require("util");
const pipeline = util.promisify(require("stream").pipeline);
// const pipeline = promisify(require("stream").pipeline);

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(
  session({
    key: "userId",
    secret: "mySecret",
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const mysql = require("mysql");
const { fetchActivity } = require("./helperfunctionActivity");
//const { promisify } = require("util");

// const db = mysql.createConnection({
//   user: "admin",
//   host: "splitwise.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
//   password: "password",
//   database: "splitwise",
// });

const db = mysql.createPool({
  connectionLimit: 10,
  host: "splitwise.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password",
  ssl: true,
  database: "splitwise",
});

app.post("/inviteStatus", (req, res) => {
  if (req.body.status == true) {
    db.query(
      "update usersgroups set invite = 1 where groupName= ? and email = ?;",
      [req.body.groupName, req.body.email],
      (err, result) => {
        if (!err) {
          res.status(200).json({ message: "success" });
        } else {
          res.status(400).json({ error: "an error occured" });
        }
      }
    );
  } else {
  }
});

app.post("/exitGroup", (req, res) => {
  if (req.body.status == true) {
    db.query(
      "update usersgroups set invite = -2 where groupName= ? and email = ?;",
      [req.body.groupName, req.body.email],
      (err, result) => {
        if (!err) {
          res.status(200).json({ message: "success" });
        } else {
          res.status(400).json({ error: "an error occured" });
        }
      }
    );
  } else {
  }
});

const upload = multer();
app.post("/upload/:email", upload.single("file"), async function (req, res) {
  const {
    file,
    body: { name },
  } = req;

  Math.floor(Math.random * 1000);
  const fileName =
    Math.floor(Math.random(100000) * 100000) + file.detectedFileExtension;
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/public/${fileName}`)
  );
  db.query(
    "update users set photo=? where email=?",
    [fileName, req.params.email],
    (err, result) => {
      if (err != null || err != undefined) {
        res.status(400).json({ error: "failed to upload image" });
      } else {
        res.status(200).json({ message: "success" });
      }
    }
  );
  // res.status(200).json({ message: "uploaded file" });
});

app.get("/getGroupPhoto/:group/:email", (req, res) => {
  db.query(
    "select groupPicture from sgroups where groupName=?",
    [req.params.group, req.params.email],
    (err, result) => {
      if (err != null || err != undefined) {
        res.status(400).json({ error: "failed to upload image" });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.post(
  "/uploadGpPhoto/:group/:email",
  upload.single("file"),
  async function (req, res) {
    const {
      file,
      body: { name },
    } = req;

    Math.floor(Math.random * 1000);
    const fileName =
      Math.floor(Math.random(100000) * 100000) + file.detectedFileExtension;
    await pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/public/${fileName}`)
    );

    db.query(
      "update sgroups set groupPicture=? where groupName=?",
      [fileName, req.params.group, req.params.email],
      (err, result) => {
        if (err != null || err != undefined) {
          res.status(400).json({ error: "failed to upload image" });
        } else {
          res.status(200).json({ message: "success" });
        }
      }
    );
  }
);

app.get("/accountInfo/:email", (req, res) => {
  db.query(
    "select email, username, timezone, language, photo, currency, phoneNo from users where email = ?;",
    [req.params.email],
    (err, result) => {
      if (err) {
        res.status(400).json({ message: "an error occured" });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.post("/signUp", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, saltrounds, (err, hash) => {
    if (err) {
      res.status(400).json({ message: "an error occured" });
    }
    db.query(
      "INSERT INTO users (email, alias, username, password) VALUES (?,?,?,?)",
      [email, email, username, hash],
      (err, result) => {
        if (result) {
          res.status(200).json({ message: "signUp Successfull" });
        } else {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({ message: "user already exists" });
          }
        }
      }
    );
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("userId");
  return res.sendStatus(200);
});

app.post("/createGroup", (req, res) => {
  groupFunctions
    .createGroup(req.body.groupName, req.body.members, req.body.user)
    .then((result) => {
      if (result == true) {
        res.status(200).json({ messgae: "successfull" });
      } else {
        if (result.code === "ER_DUP_ENTRY") {
          res.status(409).json({ message: "group alredy exists" });
        } else {
          res.status(400).json({ message: "failed" });
        }
      }
    });
});

app.get("/groupMembers/:group", (req, res) => {
  groupFunctions.getGroupMembers(req.params.group).then((result) => {
    res.send(result);
  });
});

app.post("/addBill", (req, res) => {
  billFunctions
    .insertIntoBill(
      req.body.amount,
      req.body.billData,
      req.body.user,
      req.body.group
    )
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(400).json({ message: "failed" });
      }
    });
});

app.post("/updateAccountInfo", (req, res) => {
  db.query(
    "update users set currency=? , phoneNo=? , username=?  where  email = ?",
    [req.body.currency, req.body.phoneNo, req.body.name, req.body.email],
    (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.get("/Activity/:user", (req, res) => {
  activity.fetchActivity(req.params.user).then((result) => {
    if (result) {
      res.status(200).json({ activity: result });
    } else {
      res.status(400).json({ message: "failed to fetch activity" });
    }
  });
});

app.get("/fetchBills/:group", (req, res) => {
  billFunctions.fetchBillsForGroup(req.params.group).then((result) => {
    res.status(200).send(result);
  });
});

app.get("/allUsers", (req, res) => {
  db.query("SELECT email, username from users", (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      res.status(400).json({ error: "an error occured" });
    }
  });
});

app.post("/settleUp", (req, res) => {
  billFunctions
    .settleUp(req.body.sender, req.body.reciever, req.body.amount)
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "settled up" });
      } else {
        res.status(400).json({ message: "failed to settle up" });
      }
    });
});

app.get("/invites/:email", (req, res) => {
  db.query(
    "SELECT * FROM splitwise.usersgroups where email=? and invite = 0;",
    [req.params.email],
    (err, result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "failed" });
      }
    }
  );
});

let getMembersAcrossGroups = (stringGroups) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT distinct email from usersgroups where groupName in" +
        "  ( " +
        stringGroups +
        " ) and (invite=1 or invite=-1)",
      (err, result) => {
        resolve(result);
      }
    );
  });
};

async function fetchResultIOweV1Group(user, group) {
  let result = [];

  let members = await groupFunctions.getGroupMembers(group);
  if (!members) {
    members = [];
  }
  for (let email of members) {
    let sent = await groupFunctions.getAmount(user, email.email);
    let recieved = await groupFunctions.getAmount(email.email, user);
    let diff = sent[0].Sum - recieved[0].Sum;
    result.push({ email: email.email, amt: diff });
  }
  return result;
}

async function fetchResultIOweV1(user) {
  let result = [];
  let groups = await groupFunctions.getGroups(user);
  let stringGroups = "";
  if (!groups) {
    return;
  }
  for (let group of groups) {
    stringGroups = stringGroups + "'" + group.groupName + "',";
  }
  stringGroups = stringGroups.substring(0, stringGroups.length - 1);
  let members = await getMembersAcrossGroups(stringGroups);
  if (!members) {
    members = [];
  }
  for (let email of members) {
    let sent = await groupFunctions.getAmount(user, email.email);
    let recieved = await groupFunctions.getAmount(email.email, user);
    let diff = sent[0].Sum - recieved[0].Sum;
    result.push({ email: email.email, amt: diff });
  }
  return result;
}

async function getFriends(user) {
  let groups = await groupFunctions.getGroups(user);

  let stringGroups = "";
  for (let group of groups) {
    stringGroups = stringGroups + "'" + group.groupName + "',";
  }
  stringGroups = stringGroups.substring(0, stringGroups.length - 1);
  let members = await getMembersAcrossGroups(stringGroups);

  return members;
}

app.get("/friends/:user", (req, res) => {
  getFriends(req.params.user).then((friends) => {
    res.send(friends);
  });
});

app.get("/groups/:user", (req, res) => {
  groupFunctions
    .getGroups(req.params.user)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/amount/v1/:user", (req, res) => {
  fetchResultIOweV1(req.params.user)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      //need to add error handling
      console.log(err);
    });
});

app.get("/amt/:user/:group", (req, res) => {
  fetchResultIOweV1Group(req.params.user, req.params.group)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      //need to add error handling
      console.log(err);
    });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

function email(alias) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT email from users where alias = ?",
      [alias],
      (err, result) => {
        if (err) {
          return false;
        } else {
          return result;
        }
      }
    );
  });
}

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("Select * from users where alias = ?", [email], (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            db.query(
              "SELECT email, username from users where alias = ?",
              [result[0].alias],
              (err, result) => {
                if (err) {
                  res.status(400).json({ message: "an error occured" });
                } else {
                  res.status(200).json(result);
                }
              }
            );
          } else {
            res.status(400).json({ message: "incorrect username or password" });
          }
        });
      } else {
        res.status(400).json({ message: "user does not exist" });

        res.end();
      }
    }
  });
});

app.listen(3001, () => {
  console.log("server running on 3001");
});

module.exports = app;
