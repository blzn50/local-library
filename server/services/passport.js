const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  user.password = '';
  // console.log('user serialize: ', user);

  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    const returnedUser = {
      id,
      name: user.name,
      email: user.email,
    };
    // console.log('id: ', id);
    // console.log('err: ', err);
    // console.log('user desc: ', returnedUser);

    if (err) return done(err);
    return done(null, returnedUser);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      // console.log('2done: ', done);
      // console.log('2password: ', password);
      // console.log('2email: ', email);

      User.findOne({ email }).exec((err, user) => {
        done(err, user);
        // if (err) return done(err);

        // if (!user) return done(null, false);

        // if (user && user.comparePassword(password, done)) {
        //   return done(null, user);
        // }
        // return done(null, false);
      });
    },
    // process.nextTick(doUserThing),
  ),
);
