const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Genre = require('../models/genre');
const Book = require('../models/book');
const { capitalizeFirstLetter } = require('../helpers/helpers');

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort({ name: 1 })
    .exec((err, genresList) => {
      if (err) return next(err);
      res.send({ title: 'Genres List', data: genresList });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre: (cb) => {
        Genre.findById(req.params.id).exec(cb);
      },

      genreBooks: (cb) => {
        Book.find({ genre: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.genre === null) {
        const error = new Error('Genre not found');
        error.status = 404;
        return next(error);
      }
      return res.send({
        genre: results.genre,
        genreBooks: results.genreBooks,
      });
    },
  );
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body('name', 'Genre name required')
    .isLength({ min: 2 })
    .trim(),

  sanitizeBody('name')
    .trim()
    .escape(),
  (req, res, next) => {
    // console.log(req.body.name);
    const errors = validationResult(req);
    const rawGenre = capitalizeFirstLetter(req.body.name);
    const genre = new Genre({ name: rawGenre });

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    Genre.findOne({ name: rawGenre }).exec((err, foundGenre) => {
      if (err) return next(err);
      if (foundGenre) {
        res.send({ url: foundGenre.url });
      } else {
        return genre.save((error) => {
          if (error) return next(error);
          return res.send({ url: genre.url });
        });
      }
    });
  },
];

// Display Genre delete form on GET.
// exports.genre_delete_get = (req, res) => {
//   res.send('NOT IMPLEMENTED: Genre delete GET');
// };

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      genre: (cb) => {
        Genre.findById(req.body.genreid).exec(cb);
      },
      genreBooks: (cb) => {
        Book.find({ genre: req.body.genreid }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.genreBooks.length > 0) {
        return res.send({ genreBooks: results.genreBooks });
      }
      return Genre.findByIdAndDelete(req.body.genreid, (error) => {
        if (error) return next(error);
        return res.send({ url: '/genres' });
      });
    },
  );
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = [
  body('name', 'Genre name required')
    .isLength({ min: 2 })
    .trim(),

  sanitizeBody('name')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const rawGenre = capitalizeFirstLetter(req.body.name);
    const genre = new Genre({ name: rawGenre, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    Genre.findByIdAndUpdate(
      req.params.id,
      genre,
      { new: true, useFindAndModify: false },
      (err, thegenre) => {
        if (err) return next(err);
        return res.send({ url: thegenre.url });
      },
    );
  },
];
