require('dotenv').config();
const secret = process.env.JWT_TOKEN;
const { useColors } = require('debug/src/browser');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const withAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if(!token){
        res.status(401).json({error: "Unauthorized: no token provided"});
    }else{
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                res.status(401).json({error: "Unauthorized: invalid token"});
            }else{
                req.email = decoded.email;
                User.findOne({email: decoded.email})
                .then(user =>{
                    req.user = user;
                    next();
                })
                .catch((err)=>{
                    res.status(401).json({error: err});
                })
            }
        })
    }
}

module.exports = withAuth;