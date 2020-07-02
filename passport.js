const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/User");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "NoobCoder",
    },
    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
      });
    }
  )
);

// used for authenticated local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({username}, (err, user) => {
      // if something goes wrong with db
      if (err) return done(err);
      // if no user exists - in the future we can redirect to signup
      if (!user) return done(null, false);
      // check if the password is correct
      console.log("printing password - ", password, username);
      console.log("user - ", user);
      user.ComparePassword(password, done);
    });
  })
);
