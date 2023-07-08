const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,
        minLength:1
    },
    description:{
        type:String,
        required:[true,"Please enter product description"]

    },
    price:{
        type:Number,
        required:[true,"Please enter the price"], 
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category!!!"]
    },
    Stock:{
        type:Number,
        default:1,
        required:[true,"Please enter stock of the product"] 
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name:{
                type:Number,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ], 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    createdAt:{
        type:Date,
        default:Date.now
    } 
})





const Product=mongoose.model("Product",productSchema);

module.exports=Product; 
