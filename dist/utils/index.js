"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPassword = exports.hashPassword = exports.generateToken = exports.getUserId = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserId = function getUserId(request) {
  var requireAuth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;
  if (header) {
    var token = header.replace("Bearer ", "");
    var decoded = _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error("Authentication required");
  }
  return null;
};

var generateToken = function generateToken(id) {
  return _jsonwebtoken2.default.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

var hashPassword = function hashPassword(password) {
  if (password.lenght < 8) {
    throw new Error("Password must be 8 characters or longer");
  }
  return _bcryptjs2.default.hash(password, 10);
};

var checkPassword = function checkPassword(check, password) {
  return _bcryptjs2.default.compare(check, password);
};

exports.getUserId = getUserId;
exports.generateToken = generateToken;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;