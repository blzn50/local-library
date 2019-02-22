const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Genre = require('../models/genre');
const Book = require('../models/book');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        title: 'Genre Detail',
        genre: results.genre,
        genreBooks: results.genreBooks,
      });
    },
  );
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body('name', 'Genre name required')
    .isLength({ min: 1 })
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
      res.send({ genre, errors: errors.array() });
      return;
    }
    Genre.findOne({ name: req.body.name }).exec((err, foundGenre) => {
      if (err) return next(err);
      if (foundGenre) return res.send({ foundGenreUrl: foundGenre.url });

      return genre.save((error) => {
        if (error) return next(error);
        return res.send({ genreUrl: genre.url });
      });
    });
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
