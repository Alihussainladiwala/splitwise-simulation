const mysql = require("mysql");

const db = mysql.createConnection({
  user: "admin",
  host: "splitwise.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
  password: "password",
  database: "splitwise",
});

async function fetchActivityFromUsersGroups(user) {
  //need to fix query ... add group clause
  return new Promise((resolve, reject) => {
    db.query(
      "select email, groupName, invitedby, timestamp from usersgroups where (invite = 1 or invite = 0) and groupName in (select groupName from usersgroups where email = ?) order by timestamp;",
      [user],
      (err, result) => {
        resolve(result);
      }
    );
  });
}

function fetchActivityFromTransactions(user) {
  console.log(user);
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT distinct transactions.groupName , transactions.sender , bill.billData, bill.time, bill.amount FROM transactions RIGHT JOIN bill ON transactions.billId = bill.billId where groupName in (select groupName from usersgroups where email = ?)",
      [user],
      (err, result) => {
        resolve(result);
      }
    );
  });
}

async function fetchActivity(user) {
  let userGpAct = await fetchActivityFromUsersGroups(user);
  let result = [];
  let objAct = {};
  //console.log(userGpAct)
  for (act of userGpAct) {
    objAct = {
      activity: "inivite",
      gp: act.groupName,
      invitedby: act.invitedby,
      invited: act.email,
      timestamp: act.timestamp,
    };
    result.push(objAct);
  }
  let transactionsAct = await fetchActivityFromTransactions(user);
  //console.log(transactionsAct)

  for (act of transactionsAct) {
    objAct = {
      activity: "transaction",
      amount: act.amount,
      gp: act.groupName,
      billData: act.billData,
      timestamp: act.time,
      sender: act.sender,
    };
    result.push(objAct);
  }

  return result;
}

module.exports = {
  fetchActivity,
};
