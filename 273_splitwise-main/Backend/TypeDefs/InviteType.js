const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const InviteType = new GraphQLObjectType({
  name: "Invite",
  fields: () => ({
    email: { type: GraphQLString },
    groupName: { type: GraphQLString },
    invite: { type: GraphQLString },
    invitedby: { type: GraphQLString },
    timestamp: { type: GraphQLString },
    photo: { type: GraphQLString },
  }),
});

module.exports = InviteType;
