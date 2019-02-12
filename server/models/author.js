const mongoose = require('mongoose');

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
});

AuthorSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

AuthorSchema.virtual('lifespan').get(function () {
  return (this.dateOfDeath.getYear() - this.dateOfBirth.getYear()).toString();
});

AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
