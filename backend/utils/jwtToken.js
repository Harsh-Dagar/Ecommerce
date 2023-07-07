const tokenFn=(user,statusCode,res)=>{
    const token=user.getJWTToken();
    const options={
        httpOnly: true,
        expires:new Date(
            Date.now+(process.env.COOKIE_EXP)*24*60*60*1000 //time in ms
        ),
    };

    return res.status(statusCode).cookie('token',token).json({
        success:true,
        user,
        token
    })
}


module.exports=tokenFn;