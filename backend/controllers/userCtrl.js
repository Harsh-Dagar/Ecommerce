const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandling');
const catchAsyncErr = require('../middleware/catchAsyncErr');
const User = require('../models/userModel');
const jwtToken = require('../utils/jwtToken');
const sendEmail=require('../utils/handleEmail');
const crypto=require('crypto');

module.exports.regUser = catchAsyncErr(async (req, res, next) => {
    const { name, email, password } = req.body;
    const currUser = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample public id",
            url: "sample url"
        }
    })
    // const currToken=currUser.getJWTToken();

    // res.status(201).json({
    //     success:true,
    //     token:currToken
    // })
    return jwtToken(currUser, 201, res);

})

module.exports.logInUser = catchAsyncErr(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password", 400));

    }
    const currUser = await User.findOne({ email }).select("+password");
    if (!currUser) {
        return next(new ErrorHandler("The e-mail address and/or password you specified are not correct.", 401));
    }
    const isPswCorrect = await currUser.cmpPsw(password);
    if (!isPswCorrect) {
        return next(new ErrorHandler("The e-mail address and/or password you specified are not correct.", 401));
    }
    // const currToken=currUser.getJWTToken();
    // return res.status(200).json({
    //     success:true,
    //     token:currToken
    // })
    return jwtToken(currUser, 200, res);
})

module.exports.logoutUser = catchAsyncErr(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Successfully logged out!!!"
    })
})



module.exports.forgetPsw = catchAsyncErr(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
    
});


module.exports.resetPsw = catchAsyncErr(async (req, res, next) => {
  console.log("HELLOWORLDDDD");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  jwtToken(user, 200, res);
})



//USER DATA AND PROFILE


module.exports.getUserData=catchAsyncErr(async(req,res,next)=>{
  const user=await User.findById(req.user.id);
  
  return res.status(200).json({
    success:true,
    user
  })
})

module.exports.updatePassword = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPswCorrect = await user.cmpPsw(req.body.oldPassword);


  if (!isPswCorrect) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  jwtToken(user, 200, res);
});

module.exports.updateProfile=catchAsyncErr(async(req,res,next)=>{
  const updateData={
    name:req.body.name,
    email:req.body.email
  }
  console.log(updateData);
  const user=await User.findByIdAndUpdate(req.user.id,updateData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })
  console.log(user);
  await user.save();
  res.status(200).json({
    success:true,
    user
  })
})