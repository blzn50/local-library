const BookInstance = require('../models/bookInstance');

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
      res.send({ title: 'Book', bookInstance });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
