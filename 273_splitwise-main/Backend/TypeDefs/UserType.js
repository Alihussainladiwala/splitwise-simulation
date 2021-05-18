const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    message: { type: GraphQLString },
    timezone: { type: GraphQLString },
    photo: { type: GraphQLString },
    currency: { type: GraphQLString },
    phoneNo: { type: GraphQLString },
    language: { type: GraphQLString },
  }),
});

// const Message = new GraphQLObjectType({
//     name: "Message",
//     fields: () => ({
//       message: {type: GraphQLString}
// })
// });

module.exports = UserType;
