const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.pre('save', function save(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  }
});

UserSchema.methods.comparePassword = function compare(password, cb) {
  bcrypt.compare(password, this.password, (error, isValid) => {
    if (error) return cb(error, 'error in compare');
    return cb(null, isValid);
  });
};

UserSchema.methods.generateJWT = function generateJWT() {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 2);
  this.password = '';
  return jwt.sign(this.toJSON(), 'secret');
};

// UserSchema.set('toObject', { virtuals: true });
// UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
