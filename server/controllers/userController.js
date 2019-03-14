const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');
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
      passport.authenticate('local', (er, usr, info) => {
        if (er) throw er;

        if (!usr) {
          return res.send({ errors: "Email/Password doesn't match." });
        }
        usr.comparePassword(req.body.password, (error, isValid) => {
          if (isValid && !error) {
            // const token = user.generateJWT();
            // res.send({ token: `JWT ${token}` });
            req.logIn(usr, (err) => {
              usr.password = '';
              if (err) {
                return next(err);
              }
              return res.send({ url: '/detail' });
            });
            // res.send('user logged in');
            // done(null, user);
          } else if (!isValid) {
            return res.send({ errors: "Email/Password doesn't match." });
            // done(null, false);
          } else {
            console.log(error);
            // return done(error);
            return next(error);
          }
        });
        // User.findOne({ email: req.body.email }, (err, user) => {
        //   if (err) throw err;
        //   console.log(user);
        //   if (!user) {
        //     return res.send({ errors: "Email/Password doesn't match" });
        //     // return done(null, false, { message: "Email/Password doesn't match" });
        //   }
        //   user.comparePassword(req.body.password, (error, isValid) => {
        //     console.log('isValid: ', isValid);
        //     console.log('error: ', error);
        //     if (isValid && !error) {
        //       // const token = user.generateJWT();
        //       // res.send({ token: `JWT ${token}` });
        //       res.send('user logged in');
        //       // done(null, user);
        //     } else if (!isValid) {
        //       res.send({ errors: "Email/Password doesn't match" });
        //       // done(null, false);
        //     } else {
        //       console.log(error);
        //       // return done(error);
        //       return next(error);
        //     }
        //   });
        // });
      })(req, res, next);
    }
  },
];

exports.user = (req, res, next) => {
  res.send(req.user);
};
