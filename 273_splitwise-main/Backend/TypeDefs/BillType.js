const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const BillType = new GraphQLObjectType({
  name: "Bill",
  fields: () => ({
    groupName: { type: GraphQLString },
    sender: { type: GraphQLString },
    billData: { type: GraphQLString },
    time: { type: GraphQLString },
    amount: { type: GraphQLString },
  }),
});

// const Message = new GraphQLObjectType({
//     name: "Message",
//     fields: () => ({
//       message: {type: GraphQLString}
// })
// });

module.exports = BillType;
