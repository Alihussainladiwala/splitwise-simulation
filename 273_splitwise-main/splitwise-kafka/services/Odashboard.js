var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for odashboard get"+ JSON.stringify(msg));
    console.log("msg.uemail", msg.email)

    mongo.Booking.find({
        oemail : msg.email
     },function(err,res){
        if(res){
         res.code = "200";
         res.value="Odashboard fetch"
         console.log("Odashboard res",res);
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