const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const { capitalizeFirstLetter } = require('../helpers/helpers');

exports.index = (req, res) => {
  async.parallel(
    {
      bookCount: (callback) => {
        Book.countDocuments({}, callback);
      },
      bookInstanceCount: (callback) => {
        BookInstance.countDocuments({}, callback);
      },
      bookInstanceAvailableCount: (callback) => {
        BookInstance.countDocuments({ status: 'Available' }, callback);
      },
      authorCount: (callback) => {
        Author.countDocuments({}, callback);
      },
      genreCount: (callback) => {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.send({ title: 'Local Library Home', error: err, data: results });
    },
  );
};

// Display list of all books.
exports.book_list = (req, res, next) => {
  Book.find({}, 'title author')
    .populate('author')
    .exec((err, books) => {
      if (err) return next(err);
      return res.send({ title: 'Book List', data: books });
    });
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
  console.log('is the request coming here?');
  async.parallel(
    {
      book: (cb) => {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(cb);
      },
      bookInstance: (cb) => {
        BookInstance.find({ book: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book === null) {
        const error = new Error('Book not found');
        error.status = 404;
        return next(error);
      }
      return res.send({ title: 'Title', book: results.book, bookInstance: results.bookInstance });
    },
  );
};

// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
  async.parallel(
    {
      authors: (cb) => {
        Author.find()
          .sort({ lastName: 1 })
          .exec(cb);
      },
      genres: (cb) => {
        Genre.find(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      return res.send({ authors: results.authors, genres: results.genres });
    },
  );
};

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('author', 'Author must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('summary', 'Summary must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('isbn', 'ISBN must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  sanitizeBody('*')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: '',
      author: '',
      summary: '',
      isbn: '',
      genre: [],
    });

    if (!errors.isEmpty()) {
      /* async.parallel(
        {
          authors: (cb) => {
            Author.find(cb);
          },
          genres: (cb) => {
            Genre.find(cb);
          },
        },
        (err, results) => {
          if (err) return next(err);
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          } */
      res.send({ errors: errors.array() });
      //   },
      // );
    } else {
      book.save((err) => {
        if (err) return next(err);
        return res.send({ url: book.url });
      });
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Book update POST');
};
