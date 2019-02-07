"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("../utils");

var Subscription = {
  comment: {
    subscribe: function subscribe(parent, _ref, _ref2, info) {
      var postId = _ref.postId;
      var prisma = _ref2.prisma;

      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      }, info);
    },

    post: {
      subscribe: function subscribe(parent, args, _ref3, info) {
        var prisma = _ref3.prisma;

        return prisma.subscription.post({
          where: {
            node: {
              published: true
            }
          }
        }, info);
      }
    },
    myPost: {
      subscribe: function subscribe(parent, args, _ref4, info) {
        var prisma = _ref4.prisma,
            request = _ref4.request;

        var userId = (0, _utils.getUserId)(request);
        return prisma.subscription.post({
          where: {
            node: {
              author: {
                id: userId
              }
            }
          }
        }, info);
      }
    }
  }
};

exports.default = Subscription;