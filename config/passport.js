const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../model/schemas/user');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

require('dotenv').config();

const opts = {
  secretOrKey: process.env.JWT_SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await User.findById({ id: payload.id });
      if (!user) {
        return done(new Error('User not found'), false);
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);
