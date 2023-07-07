 
const mongoose = require("mongoose");
const dbURL=process.env.DB_URL || 'mongodb://localhost:27017/ecommerce';


const connectToDB = () => {
  mongoose
    .connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true

    }) 
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectToDB;

