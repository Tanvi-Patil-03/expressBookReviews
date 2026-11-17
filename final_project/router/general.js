const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists."
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: "User successfully registered."
    });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found."
    });
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    const result = [];

    for (let key of keys) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }

    return res.status(200).json(result);
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    const result = [];

    for (let key of keys) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    }

    return res.status(200).json(result);
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found."
    });
});

// Task 10: Get all books using Async/Await and Axios
public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});

// Task 11: Get book by ISBN using Async/Await and Axios
public_users.get('/asyncisbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${req.params.isbn}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book"
        });
    }
});

// Task 12: Get books by author using Async/Await and Axios
public_users.get('/asyncauthor/:author', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(req.params.author)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author"
        });
    }
});

// Task 13: Get books by title using Async/Await and Axios
public_users.get('/asynctitle/:title', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(req.params.title)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title"
        });
    }
});

module.exports.general = public_users;
