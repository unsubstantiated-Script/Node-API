const express = require("express");

function routes(Book) {
	const bookRouter = express.Router();
	//Query for the complete list of books
	bookRouter
		.route("/books")
		.post((req, res) => {
			const book = new Book(req.body);
			console.log(book);

			book.save();
			return res.status(201).json(book);
		})
		.get((req, res) => {
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

	return bookRouter;
}

module.exports = routes;
