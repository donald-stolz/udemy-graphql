import { extractFragmentReplacements } from "prisma-binding";
import Comment from "./Comment";
import Mutation from "./Mutation";
import Subscription from "./Subscription";
import Post from "./Post";
import Query from "./Query";
import User from "./User";

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Post,
  User,
  Comment
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
