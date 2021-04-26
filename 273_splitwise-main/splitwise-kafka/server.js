var connection = new require("./kafka/Connection");
//topics files

var bills = require("./services/bill.js");
var fetchBills = require("./services/fetchBills.js");
var getGroups = require("./services/getGroups.js");
var addNote = require("./services/addComment.js");
var getProfile = require("./services/getAccountInfo.js");
var getActivity = require("./services/getActivity.js");
var getAmounts = require("./services/getAmounts.js");
var getInvites = require("./services/getInvites.js");

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log("data in server.js");

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log("producer.send", data);
      });
      return;
    });
  });
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("bills", bills);
handleTopicRequest("fetchBills", fetchBills);
handleTopicRequest("getGroups", getGroups);
handleTopicRequest("addNote", addNote);
handleTopicRequest("getProfile", getProfile);
handleTopicRequest("getActivity", getActivity);
handleTopicRequest("getAmounts", getAmounts);
handleTopicRequest("getInvites", getInvites);
