import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{id}"
  );
  const user = await prisma.query.user(
    {
      where: {
        id: authorId
      }
    },
    "{id name email posts {title published }}"
  );
  return user;
};

const updatePostForUser = async (postID, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postID
      },
      data: {
        ...data
      }
    },
    "{id title body author {id} }"
  );
  const user = await prisma.query.user(
    {
      where: {
        id: post.author.id
      }
    },
    "{id name posts {title published }}"
  );
  return user;
};

// updatePostForUser("cjrpky4ut00260762thfgm75u", {
//   title: "Updated post",
//   body: "lorem ipsum",
//   published: false
// });

// createPostForUser("cjrpktl4900160762j7kv7kji", {
//   title: "graph is great",
//   body: "lorem ipsum",
//   published: false
// }).then(user => console.log(JSON.stringify(user, undefined, 2)));

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
