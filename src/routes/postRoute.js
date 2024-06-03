const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  }
});

const upload = multer({ storage });


router.route('/posts')
  .post( upload.single('imageUrl'), postController.createPost)
  .get( postController.getPosts);

router.route('/posts/:id')
  .get( postController.getPostById)
  .put( upload.single('imageUrl'), postController.updatePost)
  .delete( postController.deletePost);

module.exports = router;
