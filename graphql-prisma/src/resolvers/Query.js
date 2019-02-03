const Query = {
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
};
export default Query;
