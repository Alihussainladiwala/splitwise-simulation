var mongo = require('./mongoose');

function  handle_request(msg, callback){
    var res = {};
    console.log("In handle request: for Property post"+ JSON.stringify(msg));
    console.log("msg.uemail", msg.email)

            console.log("Inside Property Post");
            var property = new mongo.Properties({
                oemail : msg.oemail,
                city : msg.city,
                state : msg.ostate,
                country : msg.country,
                headline : msg.headline,
                type: msg.propertytype,
                description : msg.descript,
                accommodates : msg.accomodates,
                bathrooms : msg.bathrooms,
                bedrooms : msg.bedrooms,
                pstartdate : msg.pstartdate,
                penddate : msg.penddate,
                price : msg.currency,
                propertypics : msg.photosproperty,
            })
                console.log("Property to be inserted",property)
                property.save().then((res)=>{
                    console.log("Property created :", res);
                    // res.sendStatus(200).end();
                    callback(null,res)
                },(err)=>{
                    console.log("Error creating property."+err);
                    // res.sendStatus(400).end();
                }) 
            }

            exports.handle_request = handle_request;