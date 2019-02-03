import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typedefs: "src/generated/prisma.graphql",
  endpoint: "localhost:4466"
});
