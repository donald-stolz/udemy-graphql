import { GraphQLServer } from "graphql-yoga";
import uuidV4 from "uuid/v4";
import db from "./db";

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter(user => {
        return db.user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com"
      };
    },
    post(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }

      return db.posts.filter(post => {
        return (
          post.body.toLowerCase().includes(args.query.toLowerCase()) ||
          post.title.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },
    comments(parent, args, { db }, info) {
      if (!args.query) {
        return db.comments;
      }
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => {
        return db.user.email === args.data.email;
      });
      if (emailTaken) {
        throw new Error("Email taken.");
      }
      const user = {
        id: uuidV4(),
        ...args.data
      };
      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("User does not exist.");
      }
      const deletedUser = db.users.splice(userIndex, 1);
      db.posts = db.posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });
      db.comments = db.comments.filter(comment => comment.author !== args.id);

      return deletedUser[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User does not exist.");
      }
      const post = {
        id: uuidV4(),
        ...args.data
      };
      db.posts.push(post);
      return post;
    },
    deletePost(parents, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) {
        throw new Error("Could not find post.");
      }
      const deletedPost = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter(comment => comment.post === args.id);

      return deletedPost[0];
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User does not exist.");
      }
      const postExists = db.posts.some(
        post => post.id === args.data.post && post.published
      );
      if (!postExists) {
        throw new Error("Post does not exist.");
      }
      const comment = {
        id: uuidV4(),
        ...args.data
      };
      db.comments.push(comment);
      return comment;
    },
    deleteComment(parents, args, { db }, info) {
      const commentIndex = db.comments.findIndex(comment => {
        return comment.id === args.id;
      });
      if (commentIndex === -1) {
        throw new Error("Could not find comment.");
      }
      return db.comments.splice(commentIndex, 1)[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => {
        return post.id === parent.author;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("The server is up at http://localhost:4000");
});
