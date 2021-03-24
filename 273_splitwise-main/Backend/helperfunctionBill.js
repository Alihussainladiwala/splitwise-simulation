const mysql = require("mysql");
const groupFunctions = require("./helperfunctionGroups");

const db = mysql.createConnection({
  user: "admin",
  host: "splitwise.cyg52rlfwtsh.us-east-2.rds.amazonaws.com",
  password: "password",
  database: "splitwise",
});

insertIntoBillTable = (amount, billData, type = 0) => {
  return new Promise((resolve, reject) => {
    db.query(
      "insert into bill (billData, amount, type) values (?, ?, ?)",
      [billData, amount, type],
      (err, result) => {
        if (err == null || err == undefined) {
          resolve(result);
        }
      }
    );
  });
};

insertIntoTransactions = (groupName, sender, reciever, splitAmount, billId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "insert into transactions (groupName, sender, reciever, amt, billId) values (?, ?, ?, ?, ?)",
      [groupName, sender, reciever, splitAmount, billId],
      (err, result) => {
        if (err == null || err == undefined) {
          resolve(true);
        }
      }
    );
  });
};

fetchBillInfo = (groupName) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT distinct transactions.groupName , transactions.sender , bill.billData, bill.time, bill.amount FROM transactions RIGHT JOIN bill ON transactions.billId = bill.billId where groupName = ?",
      [groupName],
      (err, result) => {
        resolve(result);
      }
    );
  });
};

async function fetchBillsForGroup(groupName) {
  let result = await fetchBillInfo(groupName);

  return result;
}

async function settleUp(sender, reciever, amount) {
  res = await insertIntoBillTable(amount, "settled up", 1);
  if (res) {
    let result = await insertIntoTransactions(
      0,
      sender,
      reciever,
      amount,
      res.insertId
    );
    if (!result) {
      return false;
    } else {
      return true;
    }
  }
}

async function insertIntoBill(amount, billData, sender, group) {
  let members = await groupFunctions.getGroupMembers(group);
  let splitAmount = amount / members.length;

  res = await insertIntoBillTable(amount, billData);
  if (res) {
    for (let member of members) {
      if (member.email != sender) {
        let result = await insertIntoTransactions(
          group,
          sender,
          member.email,
          splitAmount,
          res.insertId
        );
        if (!result) {
          console.log("failed to add to billData table");
          return false;
        }
      }
    }
    console.log("successfully added to billData table");
    return true;
  } else {
    console.log("failed to add to billData table");
    return false;
  }
}

module.exports = {
  insertIntoBill,
  fetchBillsForGroup,
  settleUp,
};
