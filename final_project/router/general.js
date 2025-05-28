const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  if (isValid(username))
    return res.status(200).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully created" });
});

// Get the book list available in the shop
public_users.get("/", function (_req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  const booksArray = Object.values(books);
  const bookDetails = booksArray.find((item) => item.isbn === isbn);

  if (bookDetails) res.status(200).json(bookDetails);

  return res.status(200).json({ message: "Book not found by given isbn" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const booksArray = Object.values(books);
  const bookDetails = booksArray.find((item) => item.author === author);

  if (bookDetails) res.status(200).json(bookDetails);

  return res.status(200).json({ message: "Book not found by given author" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  const booksArray = Object.values(books);
  const bookDetails = booksArray.find((item) => item.title === title);

  if (bookDetails) res.status(200).json(bookDetails);

  return res.status(200).json({ message: "Book not found by given title" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
