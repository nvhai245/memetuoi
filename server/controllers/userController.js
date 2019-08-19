const mongoose = require('mongoose');
const User = mongoose.model('User');
const sharp = require('sharp');
const multer = require('multer');
const mkdirp = require('mkdirp-promise');


exports.getUserById = async (req, res, next, id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.json({message: "User not found"});
    }
    const user = await User.findOne({ _id: id});
    if (user === null) {
        req.noUserFound = true;
        return next();
    }
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
    if (!req.isAuthUser && !req.noUserFound) {
        return res.json({ message: "You are not authorized to see these contents." });
    }
    if (req.noUserFound) {
        return res.json({message: "No user found"});
    }
    res.json(req.user);
};

exports.getUserProfile = (req, res) => {
    if (!req.profile) {
        return res.json({ message: "No user found." });
    }
    let foundUser = (({username, avatar, link, gender}) => ({username, avatar, link, gender}))(req.profile);
    res.json(foundUser);
};

exports.updateUser = async (req, res) => { 
    req.body.updatedAt = new Date().toISOString();
    const updatedUser = await User.findOneAndUpdate(
        {_id: req.user._id},
        {$set: req.body},
        {new: true, runValidators: true}
    );
    res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    if (!req.isAuthUser) {
        return res.status(400).json({ message: "You are not authorized to perform this action." });
    }
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    res.json(deletedUser);
};

exports.addFollowing = async (req, res, next) => {
    const { followId } = req.body;
    await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { following: followId } }
    );
    next();
};

exports.addFollower = async (req, res) => { 
    const {followId} = req.body;
    const user = await User.findOneAndUpdate(
        {_id: followId},
        {$push: {followers: req.user._id}},
        {new: true}
    );
    res.json(user);
};

exports.deleteFollowing = async (req, res, next) => { 
    const { followId } = req.body;
    await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { following: followId } }
    );
    next();
};

exports.deleteFollower = async (req, res) => { 
    const {followId} = req.body;
    const user = await User.findOneAndUpdate(
        {_id: followId},
        {$pull: {followers: req.user._id}},
        {new: true}
    );
    res.json(user);
};

const avatarUploadOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, next) => {
        if (file.mimetype.startsWith('image/')) {
            next(null, true);
        } else {
            next(null, false);
        }
    }
};

exports.uploadAvatar = multer(avatarUploadOptions).single('image');

exports.resizeAvatar = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.image = `static/uploads/${req.user.username}/avatar/${req.user.username}-${Date.now()}.${extension}`;
    const image = await sharp(req.file.buffer);
    await mkdirp(`static/uploads/${req.user.username}/avatar`);
    await image.resize(300, 300).toFile(`./${req.body.image}`, (err, info) => {
        if (err) {console.log(err.message)}
    });
    next();
};