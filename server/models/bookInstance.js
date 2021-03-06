const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  dueBack: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
  return `/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual('dueBackFormatted').get(function () {
  return moment(this.dueBack).format('DD MMMM, YYYY');
});

BookInstanceSchema.set('toObject', { virtuals: true });
BookInstanceSchema.set('toJSON', { virtuals: true });

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
