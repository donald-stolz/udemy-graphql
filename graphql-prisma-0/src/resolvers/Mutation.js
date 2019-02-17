import {
  getUserId,
  generateToken,
  hashPassword,
  checkPassword
} from "../utils";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken.");
    }

    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: generateToken(user.id)
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
    const isMatch = await checkPassword(args.data.password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return {
      user,
      token: generateToken(user.id)
    };
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);
    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }
    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const user = await prisma.mutation.deleteUser(
      { where: { id: userId } },
      info
    );
    return user;
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

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
  async updatePost(parents, args, { prisma, request }, info) {
    const { data } = args;
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!postExists) {
      throw new Error("Unable to update post");
    }
    const post = prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data
      },
      info
    );
    if (!post.published && data.published === false) {
      prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: post.id
          }
        }
      });
    }
    return post;
  },
  async deletePost(parents, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!postExists) {
      throw new Error("Unable to delete post");
    }
    return await prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      published: true
    });
    if (!postExists) {
      throw new Error("Unable to create comment");
    }
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
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
  async updateComment(parents, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("Unable to update comment");
    }
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
  async deleteComment(parents, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("Unable to delete comment");
    }
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
