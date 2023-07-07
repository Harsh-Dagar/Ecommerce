const catchAsyncErr = require("./catchAsyncErr");
const ErrorHandler=require('../utils/errorHandling');
const jwt=require('jsonwebtoken');
const User=require('../models/userModel');


module.exports.authUser=catchAsyncErr(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        next(new ErrorHandler("Please signin/register to view this page",401));
    }
    const info=jwt.verify(token,process.env.JWT_SECRET);
    const {id}=info;
    req.user=await User.findById(id);
    next();
})
module.exports.roleAuth=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`role: ${req.user.role} dont have permission to access!!!`,403));
        }
        return next();

    }
}

