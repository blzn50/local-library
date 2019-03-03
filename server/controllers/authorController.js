const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Author = require('../models/author');
const Book = require('../models/book');
const { capitalizeFirstLetter } = require('../helpers/helpers');

const author_list = (req, res, next) => {
  Author.find()
    .sort({ lastName: 1 })
    .exec((err, authorsList) => {
      if (err) return next(err);
      res.send({ title: 'Author List', data: authorsList });
    });
};

const author_detail = (req, res, next) => {
  async.parallel(
    {
      author: (cb) => {
        Author.findById(req.params.id).exec(cb);
      },
      authorsBook: (cb) => {
        Book.find({ author: req.params.id }, 'title summary').exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author === null) {
        const error = new Error('Author not found');
        error.status = 404;
        return next(error);
      }
      return res.send({
        title: 'Author Detail',
        author: results.author,
        authorsBook: results.authorsBook,
      });
    },
  );
};

const author_create_post = [
  body('firstName')
    .isLength({ min: 2 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('lastName')
    .isLength({ min: 2 })
    .trim()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),
  body('dateOfBirth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('dateOfDeath', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('firstName')
    .trim()
    .escape(),
  sanitizeBody('lastName')
    .trim()
    .escape(),
  sanitizeBody('dateOfBirth').toDate(),
  sanitizeBody('dateOfDeath').toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      const rawFirstName = capitalizeFirstLetter(req.body.firstName);
      const rawLastName = capitalizeFirstLetter(req.body.lastName);

      const author = new Author({
        firstName: rawFirstName,
        lastName: rawLastName,
        dateOfBirth: req.body.dateOfBirth,
        dateOfDeath: req.body.dateOfDeath,
      });
      author.save((err) => {
        if (err) return next(err);
        return res.send({ url: author.url });
      });
    }
  },
];

const author_update_get = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author update_get');
};

const author_update_post = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author update_post');
};

// const author_delete_get = (req, res, next) => {
//   async.parallel(
//     {
//       author: (cb) => {
//         Author.findById(req.params.id).exec(cb);
//       },
//       authorsBooks: (cb) => {
//         Book.find({ author: req.params.id }).exec(cb);
//       },
//     },
//     (err, results) => {
//       if (err) return next(err);
//       if (results.author === null) {
//         res.send({ url: '/authors' });
//       }
//       return res.send({ author: results.author, authorsBooks: results.authorsBooks });
//     },
//   );
// };

const author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author: (cb) => {
        Author.findById(req.body.authorid).exec(cb);
      },
      authorsBooks: (cb) => {
        Book.find({ author: req.body.authorid }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.authorsBooks.length > 0) {
        return res.send({ author: results.author, authorsBooks: results.authorsBooks });
      }
      return Author.findByIdAndDelete(req.body.authorid, (error) => {
        if (error) return next(error);
        return res.send({ url: '/authors' });
      });
    },
  );
};

module.exports = {
  author_list,
  author_detail,
  author_create_post,
  author_update_get,
  author_update_post,
  author_delete_post,
};
