const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jswt = require('jsonwebtoken');

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
                        res.status(400).json({
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
                            name : user[0].name,
                            isAdmin : user[0].isAdmin
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
}