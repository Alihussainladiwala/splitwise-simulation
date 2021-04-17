var mongo = require('./mongoose');

function  handle_request(rep, callback){
    var res = {};
    console.log("In handle request:"+ JSON.stringify(rep));
    console.log("rep.temail", rep.temail);

    console.log("Inside Messages Post");
    isfirst=rep.isfirst
    if(isfirst==true){
        var message = new mongo.Messages({
            temail: rep.temail,
            message: rep.msg,
            oemail: rep.oemail,
            headline: rep.headline,
            state: rep.state,
            city: rep.city
        })
        message.save().then((res)=>{
            console.log("Message thread created :", res);
            callback(null,res)
            // res.sendStatus(200).end();
        },(err)=>{
            console.log("Error creating Messages.");
            // res.sendStatus(400).end();
        })
    }
    else{
        mongo.Messages.findOneAndUpdate(
            {
                _id: rep.msgid,
    
            },
            { $push: { message: rep.msg }},
            { new: true, upsert: true }).then((res)=>{
                    console.log("Messages posted :", res);
                   // res.sendStatus(200).end();
                   callback(null,res)
                },(err)=>{
                    console.log("Error creating User.");
                    //res.sendStatus(400).end();
                })  
            }
    }

    exports.handle_request = handle_request;