var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for allmsgs get"+ JSON.stringify(msg));
    console.log("msg.type", msg.type)

    if(msg.type === "traveler"){
        mongo.Messages.find({
           temail : msg.email
        }).then((res)=>{
            //res.code = "200";
            console.log("Messages searched and matched",res);
            callback(null,res)
            //res.send(JSON.stringify(res));
        },(err) => {
           // res.code = "400";
            console.log("Err",err)
            //res.send("Bad Request");
        })
    }
    else{
        console.log("msg.type " ,msg.type)
        mongo.Messages.find({
            oemail : msg.email
         }).then((res)=>{
            // res.code = "200";
             console.log("Messages searched and matched owner",res);
             callback(null,res)
             //res.send(JSON.stringify(messages));
         },(err) => {
            // res.code = "400";
             console.log("Err",err)
            // res.send("Bad Request");
         })
    }
}

exports.handle_request = handle_request;