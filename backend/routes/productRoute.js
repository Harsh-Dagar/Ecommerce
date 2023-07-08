const express=require('express');
const router=express.Router();
const {getAllProducts,createProduct,updateProduct,deleteProduct, getSingleProduct, createProductReview, getAllReviews, deleteReview}=require('../controllers/productsCtrl');
const {authUser,roleAuth} = require('../middleware/authenticateUser');

router.get('/products',getAllProducts);

router.post('/admin/products/new',authUser,roleAuth("admin"),createProduct);

router.put('/admin/products/:id',authUser,roleAuth("admin"),updateProduct);

router.delete('/admin/products/:id',authUser,roleAuth("admin"),deleteProduct);
 
router.get('/products/:id',getSingleProduct);

router.put('/review',authUser,createProductReview);

router.get('/reviews',getAllReviews);

router.delete('/reviews',authUser,deleteReview);




module.exports=router;