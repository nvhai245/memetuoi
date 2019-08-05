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
        return res.status(400).json(firstError);
    }
    next();
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const user = await new User({ username, email, password });
    await User.register(user, password, (err, user) => {
        if (err) {
            return res.json(err.message);
        }
        res.json(user);
    });
};

exports.login = async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return res.status(403).json(err.message)
        }
        if (!user) {
            return res.status(404).json(info.message);
        }
        await req.logIn(user, err => {
            if (err) {
                return res.status(403).json(err.message)
            }
            res.status(200).json(user);
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    res.clearCookie("memetuoi.sid");
    req.logout();
    res.json({ message: "Logged out!" });
};

exports.fbLogin = async (accessToken, refreshToken, profile, done) => {
    User.findOne({ fbId: profile.id }, async (err, user) => {
        if (err) {
            console.log(err);  // handle errors!
        }
        if (!err && user !== null) {
            console.log(user);
            done(null, user);
        } else {
            const newUser = await new User({
                fbId: profile.id,
                username: profile.displayName,
                email: `${profile.id}@gmail.com`,
                token: accessToken
            });
            password = "Harin245";
            await User.register(newUser, password, (err, user) => {
                if (err) {
                    return console.log(err);
                }
                console.log(user);
            });
            done(null, newUser);
        }
    });
};

exports.ggLogin = async (accessToken, refreshToken, profile, done) => {
    User.findOne({ ggId: profile.id }, async (err, user) => {
        if (err) {
            console.log(err);  // handle errors!
        }
        if (!err && user !== null) {
            console.log(user);
            done(null, user);
        } else {
            const newUser = await new User({
                ggId: profile.id,
                username: profile.displayName,
                email: `${profile.id}@gmail.com`,
                token: accessToken,
                avatar: profile.photos[0].value
            });
            password = "Harin245";
            await User.register(newUser, password, (err, user) => {
                if (err) {
                    return console.log(err);
                }
                console.log(user);
            });
            done(null, newUser);
        }
    });
};

exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};