const async = require('async');
const Author = require('../models/author');
const Book = require('../models/book');

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

const author_create_get = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author create form');
};

const author_create_post = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author create');
};

const author_update_get = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author update_get');
};

const author_update_post = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author update_post');
};

const author_delete_get = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author delete_get');
};

const author_delete_post = (req, res) => {
  res.send('TO BE IMPLEMENTED: Author delete_post');
};

module.exports = {
  author_list,
  author_detail,
  author_create_get,
  author_create_post,
  author_update_get,
  author_update_post,
  author_delete_get,
  author_delete_post,
};
