var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for profile get"+ JSON.stringify(msg));
    console.log("msg.uemail", msg.email)

    mongo.Users.findOne({
        email:msg.email
    },function(err,res){
        if(res){
        res.code = "200";
        res.value="Profile fetch"
        console.log("Profile user",res);
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