import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import User from "./resolvers/User";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment
  },
  context: {
    db
  }
});

server.start(() => {
  console.log("The server is up at http://localhost:4000");
});
