const express = require('express');
const router = express.Router();
const Blog = require('../models/blogSchema');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');
const userController = require('../controllers/user');
const loginController = require('../controllers/login');
const signUpController = require('../controllers/signUp');
const blogController = require('../controllers/blog');
const commentController = require('../controllers/comment');

router.post('/signUp', signUpController.signUp);

router.post('/logIn', loginController.logIn);

router.post('/createBlog', checkAdmin, blogController.createBlog);

router.post('/createComment', checkAuth, commentController.createComment);

router.post('/editBlog', checkAdmin, blogController.editBlog);

//router.get('/getAllBlogs', blogController.getAllBlogs);
router.get('/getAllBlogs', blogController.getAllElasticBlogs);

//router.get('/blog/:blogId', blogController.getBlog);
router.get('/blog/:blogId', blogController.getElasticBlog);

module.exports = router;
