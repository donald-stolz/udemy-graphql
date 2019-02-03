import uuidV4 from "uuid/v4";

const Mutation = {
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
  updateUser(parent, args, { db }, info) {
    const { data, id } = args;
    const user = db.users.find(user => user.id === id);
    if (!user) {
      throw new Error("User does not exist.");
    }
    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => {
        return db.user.email === data.email;
      });
      if (emailTaken) {
        throw new Error("Email taken.");
      }
      user.email = data.email;
    }
    if (typeof data.name === "string") {
      user.name = data.name;
    }
    if (typeof data.age !== undefined) {
      user.age = data.age;
    }
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
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User does not exist.");
    }
    const post = {
      id: uuidV4(),
      ...args.data
    };
    db.posts.push(post);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }
    return post;
  },
  updatePost(parents, args, { db, pubsub }, info) {
    const { data, id } = args;
    const post = db.posts.find(post => post.id === id);
    const orginalPost = { ...post };
    if (!post) {
      throw new Error("Post could not be found");
    }
    if (typeof data.title === "string") {
      post.title = data.title;
    }
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;
      if (orginalPost.published && !post.published) {
        //Deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: orginalPost
          }
        });
      } else if (!orginalPost.published && post.published) {
        //Created
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.published) {
      // Updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }
    return post;
  },
  deletePost(parents, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Could not find post.");
    }
    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post === args.id);
    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
    }
    return deletedPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment:${comment.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
  },
  updateComment(parents, args, { db, pubsub }, info) {
    const { data, id } = args;
    const comment = db.comments.find(comment => comment.id === id);
    if (typeof data.text === "string") {
      comment.text = data.text;
      pubsub.publish(`comment:${comment.post}`, {
        comment: {
          mutation: "UPDATED",
          data: comment
        }
      });
    }
    return comment;
  },
  deleteComment(parents, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(comment => {
      return comment.id === args.id;
    });
    if (commentIndex === -1) {
      throw new Error("Could not find comment.");
    }
    const [comment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment:${comment.post}`, {
      comment: {
        mutation: "DELETED",
        data: comment
      }
    });
    return comment;
  }
};

export default Mutation;
