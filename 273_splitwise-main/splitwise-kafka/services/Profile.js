var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    // console.log("msg.uemail", msg.uemail)

mongo.Users.update(
    {email : msg.uemail},
    {
        $set : 
        {
            aboutme : msg.aboutme,  
            citycountry : msg.citycountry,
            company : msg.company,
            school : msg.school,
            hometown : msg.hometown,
            phone : msg.phone,
            languages : msg.languages,
            gender : msg.gender,
        }
    },function(err,res){
    if(err){
    console.log("Error updating:", err);
    res.code = "400"
    res.value="Could not update"
    res.sendStatus(400).end();

}else{
            console.log(" updating User.");
            console.log("res in kafka profile",res)
            res.code=200
            res.value="Updated Successfully!";
            //res.sendStatus(200).end();
            callback(null,res)
        }
    }
);
}

exports.handle_request = handle_request;