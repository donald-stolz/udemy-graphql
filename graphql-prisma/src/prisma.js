import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

export default prisma;

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });
//   if (!userExists) {
//     throw new Error("User not found");
//   }
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{author {id name posts {title published }}}"
//   );

//   return post.author;
// };

// const updatePostForUser = async (postID, data) => {
//   const postExists = await prisma.exists.Post({ id: postID });
//   if (!postExists) {
//     throw new Error("Post not found");
//   }
//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postID
//       },
//       data: {
//         ...data
//       }
//     },
//     "{author {id name posts {title published }}}"
//   );
//   return post.author;
// };

// updatePostForUser("cjrpky4ut00260762thfgm75u", {
//   title: "Another Update post",
//   body: "lorem ipsum",
//   published: false
// })
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// createPostForUser("cjrpktl4900160762j7kv7kji", {
//   title: "graph is great",
//   body: "lorem ipsum",
//   published: false
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(error => console.error(error));

// prisma.query
//   .comments(null, "{id text author {id name}}")
//   .then(data => console.log(data))
//   .catch(e => console.log(e));

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "I have on too",
//         body: "What a great post",
//         published: true,
//         author: {
//           connect: {
//             id: "cjrpktl4900160762j7kv7kji"
//           }
//         }
//       }
//     },
//     "{id title body published author {name}}"
//   )
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 4));
//     return prisma.query.users(null, "{name posts {title}}");
//   })
//   .then(data => console.log(data))
//   .catch(e => console.log(e));

// prisma.mutation
//   .updatePost(
//     {
//       where: {
//         id: "cjrpkxu3e001z0762vhsiedg7"
//       },
//       data: {
//         title: "Starting graphQL",
//         published: false,
//         body: "Lorem ipsum"
//       }
//     },
//     "{id}"
//   )
//   .then(() => {
//     return prisma.query.posts(null, "{title body published}");
//   })
//   .then(data => console.log(data))
//   .catch(e => console.log(e));
