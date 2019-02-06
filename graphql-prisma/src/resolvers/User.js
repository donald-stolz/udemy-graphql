import { getUserId } from "../utils";
import prisma from "../prisma";

const User = {
  email: {
    fragment: "fragment userId on User{id}",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    }
  },

  posts: {
    fragment: "fragment userId on User{ id }",
    resolve(parent, args, { request }, info) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      });
    }
  }
};

export default User;
