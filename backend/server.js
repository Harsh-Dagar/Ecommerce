const app=require('./app');
const dotenv=require('dotenv');
const connectToDB=require('./database');
dotenv.config({path:"backend/config/config.env"});
connectToDB();






app.listen(process.env.PORT,()=>{
    console.log(`server is running on port: http://localhost:${process.env.PORT}`);
})