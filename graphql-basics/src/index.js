import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Demo data
const users = [
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
    id: "3",
    name: "Sarah",
    email: "sarah@example.com"
  }
];

const posts = [
  {
    id: "0",
    title: "title",
    body: "lorem",
    published: false,
    author: "1"
  },
  {
    id: "1",
    title: "lorem ip",
    body: "ipsum dolerm",
    published: false,
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

// Type definitions (schema)
const typeDefs = `
    type Query {
		users(query: String): [User!]!
        me: User!
        post(query: String): [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
		published: Boolean!
		author: User!
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
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
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
