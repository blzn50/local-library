const mongoose = require('mongoose');

const { Schema } = mongoose;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
});

GenreSchema.virtual('url').get(function () {
  return `/catalog/genre/${this._id}`;
});

GenreSchema.set('toObject', { virtuals: true });
GenreSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Genre', GenreSchema);
