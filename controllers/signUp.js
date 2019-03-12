const User = require('../models/userSchema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
            res.status(400).json({
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
}