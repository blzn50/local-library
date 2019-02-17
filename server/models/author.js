const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
});

// eslint-disable-next-line func-names
AuthorSchema.virtual('name').get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

// eslint-disable-next-line func-names
AuthorSchema.virtual('lifespan').get(function () {
  let lifetimeString = '';
  if (this.dateOfBirth) {
    lifetimeString = moment(this.dateOfBirth).format('Do MMMM, YYYY');
  }
  lifetimeString += ' - ';
  if (this.dateOfDeath) {
    lifetimeString += moment(this.dateOfDeath).format('MMMM Do, YYYY');
  }
  return lifetimeString;
});

// eslint-disable-next-line func-names
AuthorSchema.virtual('url').get(function () {
  return `/author/${this._id}`;
});

AuthorSchema.set('toObject', { virtuals: true });
AuthorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Author', AuthorSchema);
