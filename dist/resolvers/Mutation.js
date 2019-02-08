"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require("../utils");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Mutation = {
  createUser: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
      var prisma = _ref.prisma;
      var emailTaken, password, user;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return prisma.exists.User({ email: args.data.email });

            case 2:
              emailTaken = _context.sent;

              if (!emailTaken) {
                _context.next = 5;
                break;
              }

              throw new Error("Email taken.");

            case 5:
              _context.next = 7;
              return (0, _utils.hashPassword)(args.data.password);

            case 7:
              password = _context.sent;
              _context.next = 10;
              return prisma.mutation.createUser({
                data: _extends({}, args.data, {
                  password: password
                })
              });

            case 10:
              user = _context.sent;
              return _context.abrupt("return", {
                user: user,
                token: (0, _utils.generateToken)(user.id)
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function createUser(_x, _x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    }

    return createUser;
  }(),
  login: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
      var prisma = _ref3.prisma;
      var user, isMatch;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return prisma.query.user({
                where: {
                  email: args.data.email
                }
              });

            case 2:
              user = _context2.sent;

              if (user) {
                _context2.next = 5;
                break;
              }

              throw new Error("Unable to login");

            case 5:
              _context2.next = 7;
              return (0, _utils.checkPassword)(args.data.password, user.password);

            case 7:
              isMatch = _context2.sent;

              if (isMatch) {
                _context2.next = 10;
                break;
              }

              throw new Error("Unable to login");

            case 10:
              return _context2.abrupt("return", {
                user: user,
                token: (0, _utils.generateToken)(user.id)
              });

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function login(_x5, _x6, _x7, _x8) {
      return _ref4.apply(this, arguments);
    }

    return login;
  }(),
  updateUser: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref5, info) {
      var prisma = _ref5.prisma,
          request = _ref5.request;
      var userId;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _utils.getUserId)(request);

            case 2:
              userId = _context3.sent;

              if (!(typeof args.data.password === "string")) {
                _context3.next = 7;
                break;
              }

              _context3.next = 6;
              return (0, _utils.hashPassword)(args.data.password);

            case 6:
              args.data.password = _context3.sent;

            case 7:
              return _context3.abrupt("return", prisma.mutation.updateUser({
                where: {
                  id: userId
                },
                data: args.data
              }, info));

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function updateUser(_x9, _x10, _x11, _x12) {
      return _ref6.apply(this, arguments);
    }

    return updateUser;
  }(),
  deleteUser: function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, _ref7, info) {
      var prisma = _ref7.prisma,
          request = _ref7.request;
      var userId, user;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userId = (0, _utils.getUserId)(request);
              _context4.next = 3;
              return prisma.mutation.deleteUser({ where: { id: userId } }, info);

            case 3:
              user = _context4.sent;
              return _context4.abrupt("return", user);

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function deleteUser(_x13, _x14, _x15, _x16) {
      return _ref8.apply(this, arguments);
    }

    return deleteUser;
  }(),
  createPost: function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, _ref9, info) {
      var prisma = _ref9.prisma,
          request = _ref9.request;
      var userId;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              userId = (0, _utils.getUserId)(request);
              return _context5.abrupt("return", prisma.mutation.createPost({
                data: {
                  title: args.data.title,
                  body: args.data.body,
                  published: args.data.published,
                  author: {
                    connect: { id: userId }
                  }
                }
              }, info));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function createPost(_x17, _x18, _x19, _x20) {
      return _ref10.apply(this, arguments);
    }

    return createPost;
  }(),
  updatePost: function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parents, args, _ref11, info) {
      var prisma = _ref11.prisma,
          request = _ref11.request;
      var data, userId, postExists, post;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              data = args.data;
              userId = (0, _utils.getUserId)(request);
              _context6.next = 4;
              return prisma.exists.Post({
                id: args.id,
                author: {
                  id: userId
                }
              });

            case 4:
              postExists = _context6.sent;

              if (postExists) {
                _context6.next = 7;
                break;
              }

              throw new Error("Unable to update post");

            case 7:
              post = prisma.mutation.updatePost({
                where: {
                  id: args.id
                },
                data: data
              }, info);

              if (!post.published && data.published === false) {
                prisma.mutation.deleteManyComments({
                  where: {
                    post: {
                      id: post.id
                    }
                  }
                });
              }
              return _context6.abrupt("return", post);

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function updatePost(_x21, _x22, _x23, _x24) {
      return _ref12.apply(this, arguments);
    }

    return updatePost;
  }(),
  deletePost: function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(parents, args, _ref13, info) {
      var prisma = _ref13.prisma,
          request = _ref13.request;
      var userId, postExists;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              userId = (0, _utils.getUserId)(request);
              _context7.next = 3;
              return prisma.exists.Post({
                id: args.id,
                author: {
                  id: userId
                }
              });

            case 3:
              postExists = _context7.sent;

              if (postExists) {
                _context7.next = 6;
                break;
              }

              throw new Error("Unable to delete post");

            case 6:
              _context7.next = 8;
              return prisma.mutation.deletePost({ where: { id: args.id } }, info);

            case 8:
              return _context7.abrupt("return", _context7.sent);

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function deletePost(_x25, _x26, _x27, _x28) {
      return _ref14.apply(this, arguments);
    }

    return deletePost;
  }(),
  createComment: function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(parent, args, _ref15, info) {
      var prisma = _ref15.prisma,
          request = _ref15.request;
      var userId, postExists;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              userId = (0, _utils.getUserId)(request);
              _context8.next = 3;
              return prisma.exists.Post({
                id: args.id,
                published: true
              });

            case 3:
              postExists = _context8.sent;

              if (postExists) {
                _context8.next = 6;
                break;
              }

              throw new Error("Unable to create comment");

            case 6:
              return _context8.abrupt("return", prisma.mutation.createComment({
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
              }, info));

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function createComment(_x29, _x30, _x31, _x32) {
      return _ref16.apply(this, arguments);
    }

    return createComment;
  }(),
  updateComment: function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(parents, args, _ref17, info) {
      var prisma = _ref17.prisma,
          request = _ref17.request;
      var userId, commentExists;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              userId = (0, _utils.getUserId)(request);
              _context9.next = 3;
              return prisma.exists.Comment({
                id: args.id,
                author: {
                  id: userId
                }
              });

            case 3:
              commentExists = _context9.sent;

              if (commentExists) {
                _context9.next = 6;
                break;
              }

              throw new Error("Unable to update comment");

            case 6:
              return _context9.abrupt("return", prisma.mutation.updateComment({
                where: {
                  id: args.id
                },
                data: args.data
              }, info));

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function updateComment(_x33, _x34, _x35, _x36) {
      return _ref18.apply(this, arguments);
    }

    return updateComment;
  }(),
  deleteComment: function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(parents, args, _ref19, info) {
      var prisma = _ref19.prisma,
          request = _ref19.request;
      var userId, commentExists;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              userId = (0, _utils.getUserId)(request);
              _context10.next = 3;
              return prisma.exists.Comment({
                id: args.id,
                author: {
                  id: userId
                }
              });

            case 3:
              commentExists = _context10.sent;

              if (commentExists) {
                _context10.next = 6;
                break;
              }

              throw new Error("Unable to delete comment");

            case 6:
              return _context10.abrupt("return", prisma.mutation.deleteComment({
                where: {
                  id: args.id
                }
              }, info));

            case 7:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function deleteComment(_x37, _x38, _x39, _x40) {
      return _ref20.apply(this, arguments);
    }

    return deleteComment;
  }()
};

exports.default = Mutation;