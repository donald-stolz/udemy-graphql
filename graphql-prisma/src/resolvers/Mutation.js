import uuidV4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken.");
    }

    const user = await prisma.mutation.createUser({ args: args.data }, info);
    return user;
  },
  async updateUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("User does not exist.");
    }
    prisma.mutation.updateUser(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("User does not exist.");
    }
    const user = await prisma.mutation.deleteUser(
      { where: { id: args.id } },
      info
    );
    return user;
  },
  async createPost(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.data.author });
    if (!userExists) {
      throw new Error("Could not find User.");
    }
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: { id: args.data.author }
          }
        }
      },
      info
    );
  },
  async updatePost(parents, args, { prisma }, info) {
    const { data } = args;
    const postExists = await prisma.exists.Post({ id: args.id });
    if (!postExists) {
      throw new Error("Post could not be found");
    }
    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data
      },
      info
    );
  },
  async deletePost(parents, args, { prisma }, info) {
    const postExists = await prisma.exists.Post({ id: args.id });
    if (!postExists) {
      throw new Error("Post could not be found");
    }
    return await prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  updateComment(parents, args, { prisma }, info) {
    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  deleteComment(parents, args, { db, pubsub }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export default Mutation;
