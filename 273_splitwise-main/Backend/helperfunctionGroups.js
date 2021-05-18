const mysql = require("mysql");

const db = mysql.createConnection({
  connectionLimit: 10,
  host: "database-lab3.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password123",
  ssl: true,
  database: "lab3",
});

let getGroups = (user) => {
  return new Promise((resolve, reject) => {
    try {
      db.query(
        "SELECT distinct groupName, photo from usersgroups where email=? and (invite=1 or invite=-1)",
        [user],
        (err, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

let getGroupMembers = (groupName) => {
  //SELECT distinct email from usersgroups where groupName="Apt 207";

  return new Promise((resolve, reject) => {
    db.query(
      "SELECT distinct email from usersgroups where groupName= ? and (invite=1 or invite=-1)",
      [groupName],
      (err, result) => {
        resolve(result);
      }
    );
  });
};

let getAmount = (user, email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "Select SUM(amt) As Sum from transactions where reciever=? and sender=?;",
      [email, user],
      (err, result) => {
        resolve(result);
      }
    );
  });
};

let createGroupUserGroupsDb = (member, groupName, invite, invitedBy) => {
  return new Promise((resolve, reject) => {
    db.query(
      "insert into usersgroups (email, groupName, invite, invitedby) values (?, ?, ?, ?)",
      [member, groupName, invite, invitedBy],
      (err, result) => {
        if (err == null || err == undefined) {
          resolve(true);
          console.log(err);
        } else {
          resolve(false);
        }
      }
    );
  });
};

let createGroupDb = (groupName, Picture) => {
  return new Promise((resolve, reject) => {
    db.query(
      "insert into sgroups values (?, ?)",
      [groupName, Picture],
      (err, result) => {
        if (err == null || err == undefined) {
          resolve(true);
        } else {
          console.log(err);
          resolve(err);
        }
      }
    );
  });
};

async function createGroup(groupName, members, user) {
  let res = await createGroupDb(groupName, ""); //need to check
  console.log(members);

  if (res == true) {
    res = await createGroupUserGroupsDb(user, groupName, -1, user);
    if (res == true) {
      let result = false;
      for (member of members) {
        console.log(member, "inside loop");
        result = await createGroupUserGroupsDb(member, groupName, 0, user);

        if (result) {
          console.log("operation success");
        } else {
          console.log("operation failed");
          return false;
        }
      }
      return true;
    } else {
      return res;
    }
  } else {
    return res;
  }
}

module.exports = {
  getGroups,
  getGroupMembers,
  getAmount,
  createGroup,
};
