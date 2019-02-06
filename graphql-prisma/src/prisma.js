import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "abc123",
  fragmentReplacements
});

export default prisma;
