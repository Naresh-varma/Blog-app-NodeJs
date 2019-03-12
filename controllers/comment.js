const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const mongoose = require('mongoose');

exports.createComment = (req, res, next) => {
    const comment = new Comment({
      _id : new mongoose.Types.ObjectId,
      user_id : req.data.user_id,
      blog_id : req.body.blog_id,
      description : req.body.description
    });
    comment.save((err, comment) => {
      if(err){
        console.log('Save method failed while saving a comment');
        res.status(500).json({
          msg : err
        })
      }else{
        ///save this comment id into Blog.comments[] array
        Blog.findOneAndUpdate(
          {
            _id : req.body.blog_id,
          },
          {
            $push : {
              comments : comment._id
            }
          }, 
          (err, blog) => {
            if(err){
              console.log('Blog.findOneAndUpdate Failed');
              res.status(500).json({
                msg : err
              })
            }
            res.status(200).json({
              msg : " Hey comment successfully saved int DB",
              comment : comment
            })
          }
        );    
      }
    })
}