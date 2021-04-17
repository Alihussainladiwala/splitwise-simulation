var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for booking post"+ JSON.stringify(msg));
    console.log("msg.uemail", msg.email)

            console.log("Inside Booking Post");
                var booking = new mongo.Booking({
                    oemail : msg.oemail,
                    headline : msg.headline,
                    uemail : msg.uemail,
                    arrival : msg.arrival,
                    depart : msg.depart,
                    headline : msg.headline,
                    propertyid : msg.propertyid,
                    accommodates: msg.accommodates
                })
                console.log("Booking to be inserted",booking)
                booking.save().then((res)=>{
                    // console.log("Booking created :", booking);
                    // res.sendStatus(200).end();
                    callback(null,res)
                },(err)=>{
                    console.log("Error creating booking.");
                    // res.sendStatus(400).end();
                }) 
            }

            exports.handle_request = handle_request;