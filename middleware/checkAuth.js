const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

module.exports =  (req, res, next) => {
    jwt.verify(req.body.token, 'decryptKey', (err, decoded) => {
        if(err){
            console.log('Token invalid : verify function failed');
            res.status('500').json({
                isLogedIn : false,
                msg: "please pass token"
            })
        }else{
        
            console.log('User Token identfied');
            req.data = decoded;
            next();
        }
        
    })
}