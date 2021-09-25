const express = require("express");
const mongoose = require("mongoose");

const app = express();
const db = mongoose.connect("mongodb://localhost/bookAPI");
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const Book = require("./models/bookModel");

//Query for the complete list of books
bookRouter.route("/books").get((req, res) => {
	const query = {};
	if (req.query.genre) {
		query.genre = req.query.genre;
	}
	Book.find(query, (err, books) => {
		if (err) {
			return res.send(err);
		}
		return res.json(books);
	});
});

//Allowing a query for a single book ID
bookRouter.route("/books/:bookId").get((req, res) => {
	Book.findById(req.params.bookId, (err, book) => {
		if (err) {
			return res.send(err);
		}
		return res.json(book);
	});
});

app.use("/api", bookRouter);

app.get("/", (req, res) => {
	res.send("Welcome to my API Foolz!");
});

app.listen(port, () => {
	console.log(`Running on port: ${port}`);
});