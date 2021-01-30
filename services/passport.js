const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (!existingUser) {
            new User({ googleId: profile.id })
              //This part has issues (the whole if else statement)
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(`${err.message} ERRRRRRRRRRRRRR`));
          } else {
            done(null, existingUser);
          }
        })
        .catch((err) => console.log(`${err.message} ERRRRRRRRRRRRRR`));
    }
  )
);
