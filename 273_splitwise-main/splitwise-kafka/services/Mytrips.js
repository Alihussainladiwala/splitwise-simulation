var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for mytrips get"+ JSON.stringify(msg));
    console.log("msg.uemail", msg.email)

    mongo.Booking.find({
        uemail : msg.email
     },function(err,res){
        if(res){
         res.code = "200";
         res.value="My Trips fetch"
         console.log("My trips res",res);
         callback(null,res)
         // res.send(JSON.stringify(user));
     }else{
         res.code = "400";
         res.send("Bad Request");
     }
 }
 )
 }
exports.handle_request = handle_request;