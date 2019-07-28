const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

exports.validateSignup = (req, res, next) => {
    req.sanitizeBody('username');
    req.sanitizeBody('email');
    req.sanitizeBody('password');
    req.checkBody('username', 'Please enter an username').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters and contain no special characters.').isLength({ min: 4, max: 15 });
    req.checkBody('email', 'Please enter a valid email').isEmail().normalizeEmail();
    req.checkBody('password', 'Please enter a password').notEmpty();
    req.checkBody('password', 'Password must be between 6-15 characters and contain no special characters.').isLength({ min: 6, max: 15 });
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).send(firstError);
    }
    next();
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const user = await new User({ username, email, password });
    await User.register(user, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message)
        }
        res.json(user);
    });
};

exports.signin = (req, res, next) => {

};

exports.signout = (req, res) => {

};

exports.checkAuth = (req, res, next) => {

};