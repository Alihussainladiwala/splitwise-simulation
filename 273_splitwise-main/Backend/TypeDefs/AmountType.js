const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const AmountType = new GraphQLObjectType({
  name: "Amount",
  fields: () => ({
    email: { type: GraphQLString },
    amt: { type: GraphQLString },
  }),
});

// const Message = new GraphQLObjectType({
//     name: "Message",
//     fields: () => ({
//       message: {type: GraphQLString}
// })
// });

module.exports = AmountType;
