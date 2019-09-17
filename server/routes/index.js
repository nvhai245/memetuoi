const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
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
        res.redirect('/');
    });
router.get('/auth/gglogin', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback', passport.authenticate('google'),
    (req, res) => {
        res.redirect('/');
    });

// Users
router.param("userId", userController.getUserById);
router.get('/api/user_data', (req, res) => {
  if (req.user === undefined) {
      // The user is not logged in
      res.json({});
  } else {
      res.json({
          user: req.user
      });
  }
});
router
    .route('/users/:userId')
    .get(userController.getAuthUser)
    .put(
        authController.checkAuth,
        userController.uploadAvatar,
        catchErrors(userController.resizeAvatar),
        catchErrors(userController.updateUser)
    )
    .delete(authController.checkAuth, catchErrors(userController.deleteUser));
router.get("/users", userController.getUsers);
router
    .route("/users/profile/:userId")
    .get(userController.getUserProfile);

    
// Posts
router.param("postId", postController.getPostById);

router.put(
  "/posts/like",
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);
router.put(
  "/posts/unlike",
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);

router.put(
  "/posts/comment",
  authController.checkAuth,
  catchErrors(postController.toggleComment)
);
router.put(
  "/posts/uncomment",
  authController.checkAuth,
  catchErrors(postController.toggleComment)
);

router.delete(
  "/posts/:postId",
  authController.checkAuth,
  catchErrors(postController.deletePost)
);

router.post(
  "/posts/new/:userId",
  authController.checkAuth,
  postController.uploadImage,
  catchErrors(postController.resizeImage),
  catchErrors(postController.addPost)
);
router.get("/posts/by/:userId", catchErrors(postController.getPostsByUser));
router.get("/posts/feed/:userId",authController.checkAuth, catchErrors(postController.getPostFeed));


module.exports = router;