const Product = require('../models/productModel');
const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandling');
const catchAsyncErr=require('../middleware/catchAsyncErr');
const ApiFeatures=require('../utils/apiFeatures');



//Create a Product(only admin can access)
module.exports.createProduct = catchAsyncErr(async (req, res, next) => {
    req.body.user = req.user.id;
    const currProd = await new Product(req.body);
    await currProd.save();
    // console.log(currProd);
    res.status(201).json({
        success: true,
        product: currProd
    })
})


//get all the products
module.exports.getAllProducts = catchAsyncErr(async (req, res,next) => {
    const productCount=await Product.countDocuments();
    const resPerPage=2;
    const apiF=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resPerPage);
    const products = await apiF.query;
    // console.log(products);
    res.status(200).json({
        success: true,
        products,
        productCount
    })
})


//update the product (only admin can access)

module.exports.updateProduct = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);

    let product = null;
    if (isValid) {
        product = await Product.findById(id);
    }
    // console.log("$$$$$$$$$$$$$$$$", product);
    if (!product) {
        return next(new ErrorHandler("Product not found!!!!!",404));
    }
    else {
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        return res.status(200).json({
            success: true,
            product
        })

    }
}
)
//delete a product (admin only)

module.exports.deleteProduct =catchAsyncErr( async (req, res, next) => {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);

    let product = null;
    if (isValid) {
        product = await Product.findById(id);
    }
    // console.log("$$$$$$$$$$$$$$$$", product);
    if (!product) {
        return next(new ErrorHandler("Product not found!!!!!",404));
    }
    await product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Deletion of product is successfull!!!"
    })

}
)

//get a single product

module.exports.getSingleProduct = catchAsyncErr(async (req, res, next) => {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);

    let product = null;
    if (isValid) {
        product = await Product.findById(id);
    }
    // console.log("$$$$$$$$$$$$$$$$", product);
    if (!product) {
        return next(new ErrorHandler("Product not found!!!!!",404));
    }
    return res.status(200).json({
        success: true,
        product: product
    })
})


//adding reviews and updating them

module.exports.createProductReview=catchAsyncErr(async(req,res,next)=>{
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
})



module.exports.getAllReviews=catchAsyncErr(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found!!!",404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

module.exports.deleteReview=catchAsyncErr(async(req,res,next)=>{
    console.log(req.query.pid);
    const product=await Product.findById(req.query.pid);
    if(!product){
        return next(new ErrorHandler("Product Not Found!!!",404));
    }
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    let avg = 0;
    console.log(reviews);

    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.pid,
      {
        
        reviews:reviews,
        ratings:ratings,
        numOfReviews:numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
})