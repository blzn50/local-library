const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

// Virtual for book's URL
BookSchema.virtual('url').get(function () {
  return `/book/${this._id}`;
});

BookSchema.set('toObject', { virtuals: true });
BookSchema.set('toJSON', { virtuals: true });

// Export model
module.exports = mongoose.model('Book', BookSchema);
