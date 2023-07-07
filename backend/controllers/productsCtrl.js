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