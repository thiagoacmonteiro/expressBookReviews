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

async function getAllBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;

      if (success) {
        resolve(books);
      } else {
        reject(new Error("Error getting books"));
      }
    }, 3000);
  });
}

// Get the book list available in the shop
public_users.get("/", async function (_req, res) {
  try {
    const allBooks = await getAllBooks();

    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

async function getBookDetailsByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;

      const booksArray = Object.values(books);
      const bookDetails = booksArray.find((item) => item.isbn === isbn);

      if (success) {
        resolve(bookDetails);
      } else {
        reject(new Error("Error getting book details by isbn"));
      }
    }, 3000);
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;

  try {
    const bookDetails = await getBookDetailsByISBN(isbn);

    if (bookDetails) return res.status(200).json(bookDetails);

    return res.status(200).json({ message: "Book not found by given isbn" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

async function getBookDetailsByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;

      const booksArray = Object.values(books);
      const bookDetails = booksArray.find((item) => item.author === author);

      if (success) {
        resolve(bookDetails);
      } else {
        reject(new Error("Error getting book details by author"));
      }
    }, 3000);
  });
}

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;

  try {
    const bookDetails = await getBookDetailsByAuthor(author);

    if (bookDetails) return res.status(200).json(bookDetails);

    return res.status(200).json({ message: "Book not found by given author" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

async function getBookDetailsByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;

      const booksArray = Object.values(books);
      const bookDetails = booksArray.find((item) => item.title === title);

      if (success) {
        resolve(bookDetails);
      } else {
        reject(new Error("Error getting book details by title"));
      }
    }, 3000);
  });
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;

  try {
    const bookDetails = await getBookDetailsByTitle(title);

    if (bookDetails) return res.status(200).json(bookDetails);

    return res.status(200).json({ message: "Book not found by given title" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  const booksArray = Object.values(books);
  const bookDetails = booksArray.find((item) => item.isbn === isbn);

  if (bookDetails) return res.status(200).json(bookDetails.reviews);

  return res.status(200).json({ message: "Book not found by given isbn" });
});

module.exports.general = public_users;
