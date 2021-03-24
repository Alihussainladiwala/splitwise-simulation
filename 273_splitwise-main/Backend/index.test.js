const assert = require("chai").assert;
const index = require("./index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

describe("Login Test", function () {
  it("Incorrect Password", () => {
    agent
      .post("/login")
      .send({ email: "ali@gmail.com", password: "password" })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"message":"incorrect username or password"}'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Sign Up", function () {
  it("Sign up", () => {
    agent
      .post("/signUp")
      .send({
        username: "xxxxxxxxxxx",
        email: "xxxxxxxxxxx@gmail.com",
        password: "xxxxxxxxxxx",
      })
      .then(function (res) {
        expect(res.text).to.equal('{"message":"signUp Successfull"}');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Groups Test", function () {
  it("Get Groups of a User", () => {
    agent
      .get("/groups/harry")
      .then(function (res) {
        // console.log(res.text);
        expect(res.text).to.equal(
          JSON.stringify([{ groupName: "gp101", photo: "leo.png" }])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Fetch bills", function () {
  it("Get Bills of a Group", () => {
    agent
      .get("/fetchBills/Apt 208")
      .then(function (res) {
        expect(res.text).to.equal(
          JSON.stringify([
            {
              groupName: "Apt 208",
              sender: "ali@gmail.com",
              billData: "bill",
              time: "0000-00-00 00:00:00",
              amount: 15,
            },
            {
              groupName: "Apt 208",
              sender: "karan@gmail.com",
              billData: "bill",
              time: "0000-00-00 00:00:00",
              amount: 15,
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
  it("Customer Profile", () => {
    agent
      .get("/accountInfo/harry")
      .then(function (res) {
        console.log(res.text);
        expect(res.text).to.equal(
          JSON.stringify([
            {
              email: "harry",
              username: "harry",
              timezone: "utc",
              language: "English",
              photo: "leo.png",
              currency: "",
              phoneNo: null,
            },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
