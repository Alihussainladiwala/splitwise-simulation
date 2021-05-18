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
const UserType = require("./TypeDefs/UserType");
const BillType = require("./TypeDefs/BillType");
const InviteType = require("./TypeDefs/InviteType");
const GroupType = require("./TypeDefs/GroupType");
const AmountType = require("./TypeDefs/AmountType");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = graphql;
const { graphqlHTTP } = require("express-graphql");

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
const { resolve } = require("path");
//const { promisify } = require("util");

// const db = mysql.createConnection({
//   user: "admin",
//   host: "splitwise.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
//   password: "password",
//   database: "splitwise",
// });

const db = mysql.createPool({
  connectionLimit: 10,
  host: "database-lab3.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password123",
  ssl: true,
  database: "lab3",
});

const inviteStatus = (groupName, email, status) => {
  return new Promise((resolve, reject) => {
    if (status == "true") {
      db.query(
        "update usersgroups set invite = 1 where groupName= ? and email = ?;",
        [groupName, email],
        (err, result) => {
          if (!err) {
            resolve({ message: "success" });
          } else {
            reject({ error: "an error occured" });
          }
        }
      );
    } else {
    }
  });
};

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

const getAccountInfo = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "select email, username, timezone, language, photo, currency, phoneNo from users where email = ?;",
      [email],
      (err, result) => {
        if (err) {
          console.log(err);
          reject({ message: "an error occured" });
        } else {
          console.log(result);
          resolve(result[0]);
        }
      }
    );
  });
};

const signUp = (username, email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltrounds, (err, hash) => {
      if (err) {
        reject({ message: "an error occured" });
      }
      db.query(
        "INSERT INTO users (email, alias, username, password) VALUES (?,?,?,?)",
        [email, email, username, hash],
        (err, result) => {
          if (result) {
            resolve({ message: "signUp Successfull" });
          } else {
            if (err.code === "ER_DUP_ENTRY") {
              console.log("error");
              reject({ message: "user already exists" });
            }
          }
        }
      );
    });
  });
};

app.get("/logout", (req, res) => {
  res.clearCookie("userId");
  return res.sendStatus(200);
});

const createGroup = (groupName, members, user) => {
  return new Promise((resolve, reject) => {
    groupFunctions.createGroup(groupName, members, user).then((result) => {
      console.log(members);
      if (result == true) {
        resolve({ message: "successfull" });
      } else {
        if (result.code === "ER_DUP_ENTRY") {
          reject({ message: "group already exists" });
        } else {
          reject({ message: "failed" });
        }
      }
    });
  });
};

app.get("/groupMembers/:group", (req, res) => {
  groupFunctions.getGroupMembers(req.params.group).then((result) => {
    res.send(result);
  });
});

const addBill = (amount, billData, user, group) => {
  return new Promise((resolve, reject) => {
    billFunctions
      .insertIntoBill(amount, billData, user, group)
      .then((result) => {
        if (result) {
          resolve({ message: "success" });
        } else {
          reject({ message: "failed" });
        }
      });
  });
};

const upDateAccountInfo = (currency, phoneNo, name, email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "update users set currency=? , phoneNo=? , username=?  where  email = ?",
      [currency, phoneNo, name, email],
      (err, result) => {
        if (!err) {
          console.log(result);
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

app.get("/Activity/:user", (req, res) => {
  activity.fetchActivity(req.params.user).then((result) => {
    if (result) {
      res.status(200).json({ activity: result });
    } else {
      res.status(400).json({ message: "failed to fetch activity" });
    }
  });
});

const fetchBills = (group) => {
  return new Promise((resolve, reject) => {
    billFunctions.fetchBillsForGroup(group).then((result) => {
      console.log(result);
      resolve(result);
    });
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT email, username from users", (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject({ error: "an error occured" });
      }
    });
  });
};

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

const getInvites = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM lab3.usersgroups where email=? and invite = 0;",
      [email],
      (err, result) => {
        if (result) {
          console.log(result);
          resolve(result);
        } else {
          console.log(err);
          reject({ message: "failed" });
        }
      }
    );
  });
};

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

const getGroups = (email) => {
  return new Promise((resolve, reject) => {
    groupFunctions
      .getGroups(email)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

function getAmount(email) {
  return new Promise((resolve, reject) => {
    fetchResultIOweV1(email)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        //need to add error handling
        reject(err);
      });
  });
}

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

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    console.log("inside login");

    db.query("Select * from users where alias = ?", [email], (err, result) => {
      if (err) {
        reject({ message: err });
      } else {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              // req.session.user = result;
              db.query(
                "SELECT email, username from users where alias = ?",
                [result[0].alias],
                (err, result) => {
                  if (err) {
                    reject({ message: "an error occured" });
                  } else {
                    console.log(result, "success");
                    resolve(result[0]);
                  }
                }
              );
            } else {
              reject({ message: "incorrect username or password" });
            }
          });
        } else {
          reject({ message: "user does not exist" });
        }
      }
    });
  });
};

const Result = new GraphQLObjectType({
  name: "Result",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAmount: {
      type: new GraphQLList(AmountType),
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return getAmount(args.email)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    getGroups: {
      type: new GraphQLList(GroupType),
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return getGroups(args.email)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    getInvites: {
      type: new GraphQLList(InviteType),
      args: {
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return getInvites(args.email)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    fetchBills: {
      type: new GraphQLList(BillType),
      args: {
        group: { type: GraphQLString },
      },
      resolve(parent, args) {
        return fetchBills(args.group)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return getAllUsers()
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return login(args.email, args.password)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    getAccountInfo: {
      type: UserType,
      args: { email: { type: GraphQLString } },
      resolve(parent, args) {
        return getAccountInfo(args.email)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
  },
});

//graphql changes

// const RootQuery = new GraphQLObjectType({name: "RootQueryType",  fields: {getAccountInfo}})
const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    acceptInvite: {
      type: Result,
      args: {
        email: { type: GraphQLString },
        groupName: { type: GraphQLString },
        status: { type: GraphQLString },
      },
      resolve(parent, args) {
        return inviteStatus(args.groupName, args.email, args.status)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    addBill: {
      type: Result,
      args: {
        amount: { type: GraphQLString },
        billData: { type: GraphQLString },
        user: { type: GraphQLString },
        group: { type: GraphQLString },
      },
      resolve(parent, args) {
        return addBill(args.amount, args.billData, args.user, args.group)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    createGroup: {
      type: Result,
      args: {
        groupName: { type: GraphQLString },
        members: { type: new GraphQLList(GraphQLString) },
        user: { type: GraphQLString },
      },
      resolve(parent, args) {
        return createGroup(args.groupName, args.members, args.user)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    signUp: {
      type: Result,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return signUp(args.name, args.email, args.password)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
    updateAccountInfo: {
      type: UserType,
      args: {
        currency: { type: GraphQLString },
        phoneNo: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        upDateAccountInfo(
          args.currency,
          args.phoneNo,
          args.name,
          args.email
        ).then((result) => {
          console.log(result);
          return result;
        });
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: mutation });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3001, () => {
  console.log("server running on 3001");
});

module.exports = app;
