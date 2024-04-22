const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/Account");

module.exports = function async(passport) {
  try {
    passport.use(
      new LocalStrategy(
        { usernameField: "userName" },
        async (userName, password, done) => {
          const query = User.where({ userName: userName.toLowerCase() });
          const user = await query.findOne();
          if (!user)
            return done(null, false, {
              msg: `Username ${userName} not found.`,
            });
          if (!user.password) {
            return done(null, false, {
              msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
            });
          }
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { msg: "Invalid email or password." });
          });
        }
      )
    );
  } catch (error) {
    done(error);
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (user) return done(null, user);
      done(null, false);
    } catch (error) {
      done(error);
    }
  });
};
