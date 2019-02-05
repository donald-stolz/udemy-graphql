import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import User from "./resolvers/User";
import prisma from "./prisma";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  },
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    };
  }
});

server.start(() => {
  console.log("The server is up at http://localhost:4000");
});
