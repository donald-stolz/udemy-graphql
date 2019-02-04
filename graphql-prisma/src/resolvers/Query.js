const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  me() {
    return {
      id: "123098",
      name: "Mike",
      email: "mike@example.com"
    };
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }]
      };
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { db }, info) {
    return prisma.query.comments(opArgs, info);
  }
};
export default Query;
