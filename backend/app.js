const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const errorMW=require('./middleware/error');

app.use(express.json());
app.use(cookieParser());

const productRoute=require('./routes/productRoute');
const userRoute=require('./routes/userRoute');
app.use('/api/v1',productRoute); 
app.use('/api/v1',userRoute); 

app.use(errorMW);


module.exports=app;