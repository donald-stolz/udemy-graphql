import { GraphQLServer } from "graphql-yoga";
import uuidV4 from "uuid/v4";

// Scalar types - String, Boolean, Int, Float, ID

// Demo data
let users = [
  {
    id: "1",
    name: "Andrew",
    email: "anderew@example.com",
    age: 27
  },
  {
    id: "2",
    name: "Don",
    email: "don@example.com",
    age: 22
  },
  {
    id: "0",
    name: "Sarah",
    email: "sarah@example.com"
  }
];

let posts = [
  {
    id: "0",
    title: "title",
    body: "lorem",
    published: true,
    author: "1"
  },
  {
    id: "1",
    title: "lorem ip",
    body: "ipsum dolerm",
    published: true,
    author: "2"
  },
  {
    id: "2",
    title: "lom ip",
    body: "ip dolerm",
    published: true,
    author: "3"
  }
];

let comments = [
  {
    id: "0",
    text: "a Ipsum",
    author: "1",
    post: "2"
  },
  {
    id: "2",
    text: "o Ipsum",
    author: "1",
    post: "2"
  },
  {
    id: "3",
    text: "e Ipsum",
    author: "2",
    post: "2"
  },
  {
    id: "1",
    text: "u Ipsum",
    author: "1",
    post: "2"
  }
];

// Type definitions (schema)
const typeDefs = `
    type Query {
		users(query: String): [User!]!
        me: User!
		post(query: String): [Post!]!
		comments(query: String): [Comment!]!
	}
	
	type Mutation {
		createUser(data: CreateUserInput): User!
		deleteUser(id: ID!): User!
		createPost(data: CreatePostInput): Post!
		deletePost(id: ID!): Post!
		createComment(data: CreateCommentInput): Comment!
		deleteComment(id: ID!): Comment!
	}

	input CreateUserInput{
		name: String!
		email: String!
		age: Int!
	}

	input CreatePostInput{
		title: String!
		body: String!
		published: Boolean!
		author: ID!
	}

	input CreateCommentInput{
		text: String!
		author: ID!
		post: ID!
	}

    type User {
        id: ID!
        name: String!
        email: String!
		age: Int
		posts: [Post!]!
		comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}
	
	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
	}
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com"
      };
    },
    post(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        return (
          post.body.toLowerCase().includes(args.query.toLowerCase()) ||
          post.title.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => {
        return user.email === args.data.email;
      });
      if (emailTaken) {
        throw new Error("Email taken.");
      }
      const user = {
        id: uuidV4(),
        ...args.data
      };
      users.push(user);
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("User does not exist.");
      }
      const deletedUser = users.splice(userIndex, 1);
      posts = posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });
      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUser[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User does not exist.");
      }
      const post = {
        id: uuidV4(),
        ...args.data
      };
      posts.push(post);
      return post;
    },
    deletePost(parents, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) {
        throw new Error("Could not find post.");
      }
      const deletedPost = posts.splice(postIndex, 1);
      comments = comments.filter(comment => comment.post === args.id);

      return deletedPost[0];
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User does not exist.");
      }
      const postExists = posts.some(
        post => post.id === args.data.post && post.published
      );
      if (!postExists) {
        throw new Error("Post does not exist.");
      }
      const comment = {
        id: uuidV4(),
        ...args.data
      };
      comments.push(comment);
      return comment;
    },
    deleteComment(parents, args, ctx, info) {
      const commentIndex = comments.findIndex(comment => {
        return comment.id === args.id;
      });
      if (commentIndex === -1) {
        throw new Error("Could not find comment.");
      }
      return comments.splice(commentIndex, 1)[0];
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comments => {
        return comments.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comments => {
        return comments.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(posts => {
        return posts.id === parent.author;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up at http://localhost:4000");
});
