"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var users = [{
  id: "1",
  name: "Andrew",
  email: "anderew@example.com",
  age: 27
}, {
  id: "2",
  name: "Don",
  email: "don@example.com",
  age: 22
}, {
  id: "0",
  name: "Sarah",
  email: "sarah@example.com"
}];

var posts = [{
  id: "0",
  title: "title",
  body: "lorem",
  published: true,
  author: "1"
}, {
  id: "1",
  title: "lorem ip",
  body: "ipsum dolerm",
  published: true,
  author: "2"
}, {
  id: "2",
  title: "lom ip",
  body: "ip dolerm",
  published: true,
  author: "3"
}];

var comments = [{
  id: "0",
  text: "a Ipsum",
  author: "1",
  post: "2"
}, {
  id: "2",
  text: "o Ipsum",
  author: "1",
  post: "2"
}, {
  id: "3",
  text: "e Ipsum",
  author: "2",
  post: "2"
}, {
  id: "1",
  text: "u Ipsum",
  author: "1",
  post: "2"
}];

var db = {
  users: users,
  posts: posts,
  comments: comments
};

exports.default = db;