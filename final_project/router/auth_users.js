const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((item) => item.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (item) => item.username === username && item.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: { username, password },
      },
      "secret",
      { expiresIn: 3600 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).send({ message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  const { review } = req.query;

  const booksEntries = Object.entries(books);

  const foundEntry = booksEntries.find((item) => item[1].isbn === isbn);

  if (foundEntry) {
    books[foundEntry[0]].reviews = {
      ...books[foundEntry[0]].reviews,
      [username]: review,
    };

    return res.status(201).json({ message: "Review successfully added" });
  }

  return res.status(400).json({ message: "Book not found by given isbn" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;

  const booksEntries = Object.entries(books);

  const foundEntry = booksEntries.find((item) => item[1].isbn === isbn);

  if (foundEntry) {
    delete books[foundEntry[0]].reviews[username];

    return res.status(201).json({ message: "Review successfully deleted" });
  }

  return res.status(400).json({ message: "Book not found by given isbn" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
