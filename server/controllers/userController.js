const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const User = require('../models/user');

exports.signup = [
  body('name', 'Name must be specified.')
    .isLength({ min: 5 })
    .trim()
    .withMessage('Please input full name.'),
  body('email', 'Email must be specified')
    .trim()
    .isEmail()
    .withMessage('Please input valid email.'),
  body('password')
    .isLength({ min: 7 })
    .withMessage('Password must be at least 7 characters long.'),

  sanitizeBody('name')
    .trim()
    .escape(),
  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
  sanitizeBody('password').trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      user.save((err) => {
        if (err) {
          console.log(err);
          if (err.code === 11000) {
            return res.send({
              errors: 'Email already used. Please use new email to sign up or go to login page',
            });
          }
          return next(err);
        }
        return res.json({ message: 'User created successfully!' });
      });
    }
  },
];

exports.login = [
  body('email', 'Email must be specified')
    .trim()
    .isEmail()
    .withMessage('Please input valid email.'),
  body('password')
    .isLength({ min: 7 })
    .withMessage('Password must be at least 7 characters long.'),

  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
  sanitizeBody('password').trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;
        if (!user) {
          return res.send({ errors: "Email/Password doesn't match" });
        }
        user.comparePassword(req.body.password, (error, isValid) => {
          if (isValid && !error) {
            const token = user.generateJWT();
            res.send({ token: `JWT ${token}` });
          } else if (!isValid) {
            res.send({ errors: "Email/Password doesn't match" });
          } else {
            console.log(error);
            return next(error);
          }
        });
      });
    }
  },
];

exports.user = (req, res, next) => {};
