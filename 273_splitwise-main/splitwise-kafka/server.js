var connection = new require("./kafka/Connection");
//topics files

var Profile = require("./services/Profile.js");
var Profileget = require("./services/Profileget.js");
var Mytrips = require("./services/Mytrips.js");
var Odashboard = require("./services/Odashboard.js");
var Booking = require("./services/Booking.js");
var Property = require("./services/Property.js");
var Messagepost = require("./services/Messagepost.js");
var Allmsgs = require("./services/Allmsgs.js");
var Gettmsgs = require("./services/Gettmsgs.js");
var bills = require("./services/bill.js");

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
// handleTopicRequest("login",Login)
// handleTopicRequest("profilepost",Profile)
// handleTopicRequest("profileget",Profileget)
// handleTopicRequest("mytrips",Mytrips)
// handleTopicRequest("odashboard",Odashboard)
// handleTopicRequest("booking",Booking)
// handleTopicRequest("property",Property)
// handleTopicRequest("messagepost",Messagepost)
// handleTopicRequest("allmsgs",Allmsgs)
// handleTopicRequest("gettmsgs",Gettmsgs)
handleTopicRequest("bills", bills);
