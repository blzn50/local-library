const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err, 'in deserialize');
    return done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (email, password, done) => {
      console.log('done: ', done);
      console.log('password: ', password);
      console.log('email: ', email);

      User.findOne({ email }).exec((err, user) => {
        if (err) return done(err);

        if (!user) return done(null, false);

        return done(null, user);
      });
    },
  ),
);
