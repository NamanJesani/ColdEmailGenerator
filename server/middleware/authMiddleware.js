const jwt= require('jsonwebtoken');
const user= require('../models/userModel.js');

const protect= async (req,res,next)=>{
    try{
        const token= req.header('Authorization').replace('Bearer ','');
        if(!token){
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        const User= await user.findById(decoded.userId);
        if(!User){
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user=User;
        next();
    }catch(error){
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = protect;