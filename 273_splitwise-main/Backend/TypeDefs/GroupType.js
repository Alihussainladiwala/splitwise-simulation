const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const GroupType = new GraphQLObjectType({
  name: "GroupType",
  fields: () => ({
    groupName: { type: GraphQLString },
    photo: { type: GraphQLString },
  }),
});

module.exports = GroupType;
