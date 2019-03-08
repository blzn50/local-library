const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');

// Display list of all BookInstances.
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, bookInstances) => {
      if (err) return next(err);
      return res.send({ title: 'Book Instance List', data: bookInstances });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookInstance) => {
      if (err) return next(err);
      if (bookInstance === null) {
        const error = new Error('Book copy not found');
        error.status = 404;
        return next(error);
      }
      res.send({ bookInstance });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, 'title').exec((err, books) => {
    if (err) return next(err);
    return res.send({ bookList: books });
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),
  body('imprint', 'Imprint must be specified')
    .isLength({ min: 5 })
    .trim(),
  body('dueBack', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('book')
    .trim()
    .escape(),
  sanitizeBody('imprint')
    .trim()
    .escape(),
  sanitizeBody('status')
    .trim()
    .escape(),
  sanitizeBody('dueBack').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
    });

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      bookInstance.save((err) => {
        if (err) return next(err);
        return res.send({ url: bookInstance.url });
      });
    }
  },
];

// Display BookInstance delete form on GET.
// exports.bookinstance_delete_get = (req, res) => {
//   res.send('NOT IMPLEMENTED: BookInstance delete GET');
// };

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res, next) => {
  BookInstance.findByIdAndDelete(req.body.bookinstanceid, (err) => {
    if (err) return next(err);
    res.send({ url: '/bookinstances' });
  });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  // res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),
  body('imprint', 'Imprint must be specified')
    .isLength({ min: 5 })
    .trim(),
  body('dueBack', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('book')
    .trim()
    .escape(),
  sanitizeBody('imprint')
    .trim()
    .escape(),
  sanitizeBody('status')
    .trim()
    .escape(),
  sanitizeBody('dueBack').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      BookInstance.findByIdAndUpdate(
        req.params.id,
        bookInstance,
        { new: true, useFindAndModify: false },
        (err, thebookinstance) => {
          if (err) return next(err);
          return res.send({ url: thebookinstance.url });
        },
      );
    }
  },
];
