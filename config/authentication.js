
var Strategy = require('passport-local').Strategy
  , db = require('./../app/models/index.js');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use('local', new Strategy({ session: true },
    function (username, password, done) {
      db.Login.verifyLogin(username, password, function (err, user) {
        if (err) {
          return done('An error has occurred please try again later.', false);
        }
        if (!user) {
          return done(null, false, {message:'Invalid Username/Password.'});
        }
        return done(null, user);

      });
    }));
};