const mysql = require("mysql");

const db = mysql.createConnection({
  user: "admin",
  host: "splitwise.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
  password: "password",
  database: "splitwise",
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
          resolve(err);
        }
      }
    );
  });
};

async function createGroup(groupName, members, user) {
  let res = await createGroupDb(groupName);

  if (res == true) {
    res = await createGroupUserGroupsDb(user, groupName, -1, user);
    if (res == true) {
      let result = false;
      for (member of members) {
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
