"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("../utils");

var _prisma = require("../prisma");

var _prisma2 = _interopRequireDefault(_prisma);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = {
  email: {
    fragment: "fragment userId on User{id}",
    resolve: function resolve(parent, args, _ref, info) {
      var request = _ref.request;

      var userId = (0, _utils.getUserId)(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    }
  },

  posts: {
    fragment: "fragment userId on User{ id }",
    resolve: function resolve(parent, args, _ref2, info) {
      var request = _ref2.request;

      return _prisma2.default.query.posts({
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

exports.default = User;