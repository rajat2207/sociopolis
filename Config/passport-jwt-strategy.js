const passport = require("passport");
const env = require("./environment");

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../Models/user");

let opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken(),
opts.secretOrKey = env.jwt_secret_key;

//authentication using passport
passport.use(
  new JWTStrategy(opts, function (jwtPayLoad, done) {
    User.findById(jwtPayLoad._id, function (err, user) {
      if (err) {
        console.log("Error in finding the user from JWT");
        return;
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
