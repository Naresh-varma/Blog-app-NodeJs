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

/* GET users listing. */
router.post('/signUp', signUpController.signUp);

router.post('/logIn', loginController.logIn);

router.post('/createBlog', checkAdmin, blogController.createBlog);

router.post('/createComment', checkAuth, commentController.createComment);

router.post('/editBlog', checkAdmin, blogController.editBlog);

router.get('/getAllBlogs', blogController.getAllBlogs);

router.get('/blog/:blogId', blogController.getBlog);

// router.post('/editBlog', (req, res, next) => {
//   console.log('here');
//   Blog.findOneAndUpdate(
//     {
//       _id : req.body.blog_id,
//     },
//     {
//       $set : {
//         title : req.body.title,
//         description : req.body.description 
//       }
//     }, 
//     (err, blog) => {
//       if(err){
//         console.log('Blog.findOneAndUpdate Failed');
//         res.status(500).json({
//           msg : err
//         })
//       }
//       res.status(200).json({
//         msg : " Successfullt updated",
//         blog : blog
//       })
//     }
//   );
// });

// router.get('/getAllBlogs', (req, res, next) => {
//   console.log('HERE');
//   Blog.find()
//     .populate({
//       path :'comments',
//       populate : { path : 'user_id', select : 'name'}
//     })
//     .exec((err, blogs) => {
//       if(err){
//         console.log('Error in populate');
//         res.status(500).json({
//           msg : err
//         })
//       }else{
//         res.status(200).json({
//           message : blogs
          
//         })
//       }
//     })
//});

// router.get('/blog/:blogId', (req, res, next) => {
//   Blog.findOne({_id : req.params.blogId})
//     .exec((err, blog) => {
//       if(err){
//         res.status(500).json({
//           err : err
//         })
//       }else{
//         res.status(200).json({
//           blog : blog
//         })
//       }
//     })
// })
module.exports = router;
