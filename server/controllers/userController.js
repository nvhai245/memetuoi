const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.getUserById = async (req, res, next, id) => {
    const user = await User.findOne({ _id: id });
    req.profile = user;
    const profileId = mongoose.Types.ObjectId(req.profile._id);
    if (!req.user) {
        return next();
    }
    if (profileId.equals(req.user._id)) {
        req.isAuthUser = true;
        return next();
    }
    next();
};

exports.getUsers = async (req, res) => {
    const users = await User.find().select('_id username email createdAt updatedAt');
    res.send(users);
};

exports.getAuthUser = (req, res) => {
    if (!req.isAuthUser) {
        return res.json({ message: "You are not authorized to see these contents." });
    }
    res.json(req.user);
};
