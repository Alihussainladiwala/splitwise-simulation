const assert = require("chai").assert;
const index = require("../index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

var token = "";

let getToken = () => {
  return new Promise((resolve, reject) => {
    agent
      .post("/login")
      .send({ email: "ali@gmail.com", password: "123" })
      .then(function (res) {
        token = res.body.token;
        resolve(token);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

describe("Login Test", function () {
  it("Incorrect Password", () => {
    agent
      .post("/login")
      .send({ email: "ali@gmail.com", password: "password" })
      .then(function (res) {
        expect(res.text).to.equal('{"message":"incorrect password"}');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it("Successfull login", () => {
    agent
      .post("/login")
      .send({ email: "ali@gmail.com", password: "123" })
      .then(function (res) {
        expect(res.body.success).to.equal(true);
        token = res.body.token;
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Sign Up", function () {
  it("Sign user exists", () => {
    agent
      .post("/signUp")
      .send({
        name: "xxxxxxxxxx",
        email: "xxxxxxxxxx@gmail.com",
        password: "xxxxxxxxxx",
      })
      .then(function (res) {
        expect(res.text).to.equal('{"message":"email aready exists"}');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Groups Test", function () {
  it("Get Groups of a User", async () => {
    let token = await getToken();
    agent
      .get("/getGroups/ali@gmail.com")
      .set("authorization", token)
      .then(function (res) {
        expect(res.text).to.equal(
          JSON.stringify([
            { groupName: "apt 208", photo: "leo.png" },
            { groupName: "apt 209", photo: "leo.png" },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Fetch bills", function () {
  it("Get Bills of a Group", async () => {
    let token = await getToken();
    agent
      .get("/fetchBills/apt 209")
      .set("authorization", token)
      .then(function (res) {
        expect(res.text).to.equal(
          JSON.stringify([
            {
              amount: 100,
              description: "100",
              notes: [
                {
                  note: "hey there!",
                  _id: "6079d3bf09d81b480cae2513",
                  userId: "606c9c056ded733ab8d3425a",
                  username: "Ali",
                },
              ],
              createdByName: "Ali",
              _id: "6079d3b1c1344642e01568cb",
              createdBy: "606c9c056ded733ab8d3425a",
              groupName: "60753cd25fa138354cb0b808",
              timestamp: "2021-04-16T18:13:05.909Z",
              __v: 0,
            },
            {
              amount: 500,
              description: "bull",
              notes: [],
              createdByName: "Ali",
              _id: "608312ac0120cb2afc344cd9",
              createdBy: "606c9c056ded733ab8d3425a",
              groupName: "60753cd25fa138354cb0b808",
              timestamp: "2021-04-23T18:32:12.807Z",
              __v: 0,
            },
            {
              amount: 20,
              description: "20",
              notes: [],
              createdByName: "Ali",
              _id: "608312d70120cb2afc344cdc",
              createdBy: "606c9c056ded733ab8d3425a",
              groupName: "60753cd25fa138354cb0b808",
              timestamp: "2021-04-23T18:32:55.584Z",
              __v: 0,
            },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Profile Test", function () {
  it("User Prfoile", async () => {
    let token = await getToken();
    agent
      .get("/accountInfo/ali@gmail.com")
      .set("authorization", token)
      .then(function (res) {
        console.log(res.text);
        expect(res.text).to.equal(
          JSON.stringify([
            {
              photo:
                "https://splitwise-bucket-1.s3.us-east-2.amazonaws.com/d155c8fddba73b446934b19f6a70be5c.jpg",
              currency: "",
              language: "English",
              timezone: "utc",
              group: [
                {
                  _id: "6073d9844a308b0b4010a49e",
                  groupId: "6073d9844a308b0b4010a49d",
                  timestamp: "2021-04-12T05:24:20.348Z",
                },
                {
                  _id: "60753d0b5fa138354cb0b80b",
                  groupId: "60753cd25fa138354cb0b808",
                  timestamp: "2021-04-13T06:41:15.001Z",
                },
              ],
              groupInvitedTo: ["607b6bd0f4c20a2a2078d51a"],
              phoneNo: "123-234-456",
              _id: "606c9c056ded733ab8d3425a",
              name: "Ali",
              email: "ali@gmail.com",
              password:
                "$2b$10$A1E0pDP6c4WsROFVrM5kieGdtAFVvgjRLqSrAn9eYZMJUQrZOhk.G",
              __v: 0,
            },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
