import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken.");
    }
    if (args.data.password.lenght < 8) {
      throw new Error("Password must be 8 characters or longer");
    }
    const password = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, "supersecret")
    };
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });
    if (!user) {
      throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(args.data.password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    // ToDo part 3
    return {
      user,
      token: jwt.sign({ userId: user.id }, "supersecret")
    };
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
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
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
            connect: { id: userId }
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
