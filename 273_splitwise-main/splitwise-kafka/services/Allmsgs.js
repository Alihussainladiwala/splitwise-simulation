var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for allmsgs get"+ JSON.stringify(msg));
    console.log("msg.id", msg.id)

    console.log("Inside get for displaying All messages")
    mongo.Messages.find({
       _id : msg.id
    },function(err,res){
        if(res){
        res.code = "200";
        res.value="Messages fetching"
        console.log("Messages user",res);
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