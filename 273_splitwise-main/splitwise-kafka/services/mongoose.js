var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://admin:passwooord@clustersplitwise.xhibc.mongodb.net/splitwise?retryWrites=true&w=majority",
    { poolSize: 10 }
  )
  .then(
    () => {
      console.log("Mongoose is Connected");
    },
    (err) => {
      console.log("Mongoose is Not Connected" + err);
    }
  );
// Or using promises

module.exports.Users = mongoose.model("Users", {
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  usertype: {
    type: String,
  },
  aboutme: {
    type: String,
  },
  citycountry: {
    type: String,
  },
  company: {
    type: String,
  },
  school: {
    type: String,
  },
  hometown: {
    type: String,
  },
  languages: {
    type: String,
  },
  phone: {
    type: Number,
  },
  gender: {
    type: String,
  },
  profilepic: {
    type: String,
  },
});

module.exports.Booking = mongoose.model("Booking", {
  oemail: {
    type: String,
  },
  uemail: {
    type: String,
  },
  arrival: {
    type: String,
  },
  depart: {
    type: String,
  },
  headline: {
    type: String,
  },
  propertyid: {
    type: String,
  },
  accommodates: {
    type: Number,
  },
});

module.exports.Properties = mongoose.model("Properties", {
  oemail: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  headline: {
    type: String,
  },
  description: {
    type: String,
  },
  accommodates: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  bedrooms: {
    type: Number,
  },
  pstartdate: {
    type: String,
  },
  penddate: {
    type: String,
  },
  price: {
    type: Number,
  },
  propertypics: {
    type: String,
  },
  propertytype: {
    type: String,
  },
});

module.exports.Messages = mongoose.model("Messages", {
  oemail: {
    type: String,
  },
  temail: {
    type: String,
  },
  message: {
    type: Array,
  },
  headline: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
});
