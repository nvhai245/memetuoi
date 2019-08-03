const passport = require("passport");
const authController = require('./controllers/authController');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
require('dotenv').config();

passport.use(User.createStrategy());
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
  authController.fbLogin
));
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
authController.ggLogin
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());