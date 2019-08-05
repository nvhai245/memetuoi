const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const passport = require('passport');

//Errors handler
const catchErrors = fn => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

//Authentication
router.post('/auth/signup', authController.validateSignup, authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);
router.get('/auth/fblogin', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] }),
    (req, res) => {
        res.send('fb login successful!');
    });
router.get('/auth/gglogin', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback', passport.authenticate('google'),
    (req, res) => {
        res.send('Google login successful!');
    });

// Users
router.param("userId", userController.getUserById);
router
    .route('/users/:userId')
    .get(userController.getAuthUser);
router.get("/users", userController.getUsers);



module.exports = router;