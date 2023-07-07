const express=require('express');
const router=express.Router();
const {getAllProducts,createProduct,updateProduct,deleteProduct, getSingleProduct}=require('../controllers/productsCtrl');
const {authUser,roleAuth} = require('../middleware/authenticateUser');

router.get('/products',getAllProducts);

router.post('/admin/products/new',authUser,roleAuth("admin"),createProduct);

router.put('/admin/products/:id',authUser,roleAuth("admin"),updateProduct);

router.delete('/admin/products/:id',authUser,roleAuth("admin"),deleteProduct);
 
router.get('/products/:id',getSingleProduct);

module.exports=router;