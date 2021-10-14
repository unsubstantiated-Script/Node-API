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

	//Using middleware to handle our route requests
	bookRouter.use("/books/:bookId", (req, res, next) => {
		Book.findById(req.params.bookId, (err, book) => {
			if (err) {
				return res.send(err);
			}
			if (book) {
				req.book = book;
				return next();
			}
			return res.sendStatus(404);
		});
	});
	bookRouter
		.route("/books/:bookId")
		.get((req, res) => res.json(req.book))
		.put((req, res) => {
			const { book } = req;
			book.title = req.body.title;
			book.author = req.body.author;
			book.genre = req.body.genre;
			book.read = req.body.read;
			//Good async error handling
			req.book.save((err) => {
				if (err) {
					return res.send(err);
				}
				return res.json(book);
			});
		})
		.patch((req, res) => {
			const { book } = req;

			//removes id from object for now
			if (req.body._id) {
				delete req.body._id;
			}
			//Looping through the response object to only update items that exist in the object
			Object.entries(req.body).forEach((item) => {
				const key = item[0];
				const value = item[1];
				book[key] = value;
			});
			//Good async error handling
			req.book.save((err) => {
				if (err) {
					return res.send(err);
				}
				return res.json(book);
			});
		})
		.delete((req, res) => {
			req.book.remove((err) => {
				if (err) {
					return res.send(err);
				}
				return res.sendStatus(204);
			});
		});

	return bookRouter;
}

module.exports = routes;
