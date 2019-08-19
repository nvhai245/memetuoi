const sharp = require('sharp');
const multer = require('multer');
const mkdirp = require('mkdirp-promise');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const imageUploadOptions = {
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

exports.uploadImage = multer(imageUploadOptions).single('image');

exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.image = `static/uploads/${req.user.username}/${req.user.username}-${Date.now()}.${extension}`;
    const image = await sharp(req.file.buffer);
    await mkdirp(`static/uploads/${req.user.username}`);
    await image.resize(400, 750).toFile(`./${req.body.image}`, (err, info) => {
        if (err) { console.log(err.message) }
    });
    next();
};

exports.addPost = async (req, res) => {
    req.body.postedBy = req.user._id;
    const post = await new Post(req.body).save();
    await Post.populate(post, {
        path: 'postedBy',
        select: '_id username avatar'
    });
    res.json(post);
};

exports.getPostById = async (req, res, next, id) => {
    const post = await Post.findOne({ _id: id });
    req.post = post;
    const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);
    if (req.user && posterId.equals(req.user._id)) {
        req.isPoster = true;
        return next();
    }
    next();
};

exports.deletePost = async (req, res) => {
    if (!req.isPoster) {
        return res.status(400).json({ message: "You are not authorized to perform this action." });
    }
    const deletedPost = await Post.findOneAndDelete({ _id: req.post._id });
    res.json(deletedPost);
};

exports.getPostsByUser = async (req, res) => {
    const posts = await Post.find({ postedBy: req.profile._id }).sort({
        createdAt: "desc"
    });
    res.json(posts);
};

exports.getPostFeed = async (req, res) => {
    if (!req.isAuthUser) {
        res.status(403).json({ message: "You are not authorized to see these contents. Please sign in." });
        return res.redirect('/signin');
    }
    const { following, _id } = req.profile;
    following.push(_id);
    const posts = await Post.find({ postedBy: { $in: following } }).sort({
        createdAt: "desc"
    });
    res.json(posts);
};

exports.toggleLike = async (req, res) => {
    const { postId } = req.body;
    const post = await Post.findOne({ _id: postId });
    const likeIds = post.likes.map(id => id.toString());
    const authUserId = req.user._id.toString();
    if (likeIds.includes(authUserId)) {
        await post.likes.pull(authUserId);
    } else {
        await post.likes.push(authUserId);
    }
    await post.save();
    res.json(post);
};

exports.toggleComment = async (req, res) => {
    const { comment, postId } = req.body;
    let operator;
    let data;
    if (req.url.includes('uncomment')) {
        operator = "$pull";
        data = { _id: comment._id };
    } else {
        operator = "$push";
        data = { text: comment.text, postedBy: req.user._id };
    }
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { [operator]: { comments: data } },
        { new: true }
    ).populate('postedBy', "_id username avatar")
        .populate('comments.postedBy', "_id username avatar");
    res.json(updatedPost);
};