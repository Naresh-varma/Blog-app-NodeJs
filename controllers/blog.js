const Blog = require('../models/blogSchema');
const mongoose = require('mongoose');

exports.createBlog = (req, res, next) => {
    const blog = new Blog({
      _id : new mongoose.Types.ObjectId,
      title : req.body.title,
      description : req.body.description,
    });
    blog.save((err, blog) => {
      if(err){
        console.log('Server Error save fun failed');
        res.status(500).json({
          msg : "Error occured on server side",
          err : err
        })
      }else{
        res.status(200).json({
          msg : "Blog created",
          blog : blog
        })
      }
    })
},
exports.editBlog = (req, res, next) => {
    console.log('here');
    Blog.findOneAndUpdate(
        {
            _id : req.body.blog_id,
        },
        {
            $set : {
                title : req.body.title,
                description : req.body.description 
            }
        }, 
        (err, blog) => {
            if(err){
                console.log('Blog.findOneAndUpdate Failed');
                res.status(500).json({
                    msg : err
                })
            }else{
                res.status(200).json({
                    msg : " Successfullt updated",
                    blog : blog
                })
            }
            
        }
    );
},
exports.getAllBlogs = (req, res, next) => {
  Blog.find()
    .populate({
      path :'comments',
      populate : { path : 'user_id', select : 'name'}
    })
    .exec((err, blogs) => {
      if(err){
        console.log('Error in populate');
        res.status(500).json({
          msg : err
        })
      }else{
        res.status(200).json({
          message : blogs  
        })
      }
    })
},
exports.getBlog = (req, res, next) => {
    Blog.findOne({ _id : req.params.blogId })
        .populate({
            path : 'comments',
            populate : {
                path : 'user_id',
                select : 'name'
            }
        })
        .exec((err, blog) => {
            if(err){
                res.status(500).json({
                    err : err
                })
            }else{
                res.status(200).json({
                    blog : blog
                })
            }
        })
}
