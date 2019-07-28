const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//Errors handler
const catchErrors = fn => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

//Authentication
router.post('/auth/signup', authController.validateSignup, catchErrors(authController.signup));

module.exports = router;