const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const keys = require('../../config/keys');

const transport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || keys.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER || keys.MAIL_USER,
    pass: process.env.MAIL_PASS || keys.MAIL_PASS,
  },
  debug: true,
});

exports.signup = [
  body('name', 'Name must be specified.')
    .isLength({ min: 5 })
    .trim()
    .withMessage('Please input full name.'),
  body('email', 'Email must be specified')
    .trim()
    .isEmail()
    .withMessage('Please input valid email.'),
  body('password', 'Password must be specified.')
    .isLength({ min: 7 })
    .trim()
    .withMessage('Password must be at least 7 characters long.'),

  sanitizeBody('name')
    .trim()
    .escape(),
  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
  sanitizeBody('password')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      passport.authenticate('local', (er, usr, info) => {
        // console.log('info: ', info);
        // console.log('usr: ', usr);
        // console.log('er: ', er);

        if (er) throw er;
        if (usr) {
          return res.send({
            errors: [
              {
                msg: 'There is an existing account associated with that email.',
              },
            ],
          });
        }
        if (!usr) {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          user.save((error, theuser) => {
            if (error) {
              console.log(error);
              if (error.code === 11000) {
                return res.send({
                  errors: [
                    {
                      msg: 'There is an existing account associated with that email.',
                    },
                  ],
                });
              }
              return next(error);
            }
            const returnedUser = {
              id: theuser.id,
              name: theuser.name,
              email: theuser.email,
            };
            req.logIn(returnedUser, (err) => {
              // returnedUser.password = '';
              if (err) {
                return next(err);
              }
              return res.json({ message: 'User created successfully!', url: '/detail' });
            });
          });
        }
      })(req, res, next);
    }
  },
];

exports.login = [
  body('email', 'Email must be specified')
    .trim()
    .isEmail()
    .withMessage('Please input valid email.'),
  body('password', 'Password must be specified')
    .trim()
    .isLength({ min: 7 })
    .withMessage('Password must be at least 7 characters long.'),

  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
  sanitizeBody('password')
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
    } else {
      passport.authenticate('local', (er, usr, info) => {
        if (er) throw er;

        if (!usr) {
          return res.send({ errors: [{ msg: 'Your username or password is invalid.' }] });
        }
        usr.comparePassword(req.body.password, (error, isValid) => {
          if (isValid && !error) {
            const returnedUser = {
              id: usr.id,
              name: usr.name,
              email: usr.email,
            };
            req.logIn(returnedUser, (err) => {
              // usr.password = '';
              if (err) {
                return next(err);
              }
              return res.send({ url: '/detail' });
            });
            // res.send('user logged in');
            // done(null, user);
          } else if (!isValid) {
            return res.send({ errors: [{ msg: 'Your username or password is invalid.' }] });
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

exports.logout = (req, res, next) => {
  req.logout();
  res.send({ message: 'You have been logged out!' });
};
exports.user = (req, res, next) => {
  res.send(req.user);
};

exports.forgotPassword = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(errors.array());
    }
    const token = crypto.randomBytes(20).toString('hex');
    // console.log('token: ', token);

    User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000,
        },
      },
      { new: true, useFindAndModify: false },
    ).exec((err, theuser) => {
      if (err) return next(err);
      if (!theuser) {
        return res.send({ errors: 'No such email found.' });
      }

      const mailOptions = {
        from: 'Local Library <no-reply@loclibrary.com>',
        to: `${theuser.email}`,
        subject: 'Link to reset Password',
        text:
          'You are receiving this because you have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
          + `http://localhost:3000/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      transport.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.error('there was an error: ', err);
        } else {
          console.log('here is the res: ', response);
          return res.status(200).json('recovery email sent');
        }
      });
      // res.send('some data for email');
    });
  },
];

exports.resetPassword = [];
