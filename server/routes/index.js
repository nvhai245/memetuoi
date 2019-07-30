const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

//Errors handler
const catchErrors = fn => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

//Authentication
router.post('/auth/signup', authController.validateSignup, catchErrors(authController.signup));
router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);
router.get('/auth/fblogin', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}));





module.exports = router;