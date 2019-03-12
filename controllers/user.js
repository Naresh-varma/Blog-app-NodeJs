const User = require('../models/userSchema');
const Blog = require('../models/blogSchema');
const Comment = require('../models/commentSchema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jswt = require('jsonwebtoken');

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
      }
      res.status(200).json({
        msg : " Successfullt updated",
        blog : blog
      })
    }
  );
}

exports.logIn = (req, res, next) => {
    User.find({email : req.body.email}).exec()
    .then(user => {
      console.log(user);
      if(user.length < 1){
        res.status(401).json({
          message : "Auth failed no user exist"
        });
      }else{
        console.log((user[0].password));
        bcrypt.compare(req.body.password, user[0].password, (errr, result) => {
          if(!result){
            res.status.json({
              message : "Invalid user/Password "
            })
          }else{
            const token = jswt.sign(
              {
                email : user[0].email,
                user_id : user[0]._id,
                isAdmin : user[0].isAdmin
              }, 
              'decryptKey'
            );
            res.status(200).json({
              msg : 'LogIn SuccessFull',
              token : token,
              name : user[0].name
            })
          }
        }) 
      }
    })
    .catch(err => {
      if(err){
        console.log('Oops find method failed');
        res.status(500).json({
          err : err
        });
      }
    })
},
exports.signUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, encrptedpwd) => {
    if(err){
      console.log('Problem in hashing the password');
      res.status(404).json({
        err : err
      });
    }else{
      const user = new User({
        _id : new mongoose.Types.ObjectId,
        email : req.body.email,
        name : req.body.name,
        phoneNumber : req.body.phoneNumber,
        password : encrptedpwd,
        isAdmin : req.body.isAdmin
      });
      user.save((err, result) => {
        if(err){
          console.log('failed to execute save method')
          res.status(404).json({
            err : err
          })
        }else{
          console.log('Saved successfuly');
          res.status(200).json({
            message : "User Saved",
            result : result
          })
        }
      }) 
    }
  }) 
},

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