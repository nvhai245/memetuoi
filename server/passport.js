const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
require('dotenv').config();

passport.use(User.createStrategy());
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done(null, user);
  }
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());