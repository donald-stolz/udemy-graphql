"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prismaBinding = require("prisma-binding");

var _resolvers = require("./resolvers");

var prisma = new _prismaBinding.Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements: _resolvers.fragmentReplacements
});

exports.default = prisma;

// abc123