const express=require('express');
const { regUser,logInUser, logoutUser,forgetPsw, resetPsw, getUserData, updatePassword, updateProfile, getAllUsers, getAUserForAdmin, updateUserRole, deleteUser } = require('../controllers/userCtrl');
const router=express.Router();
const {authUser,roleAuth} = require('../middleware/authenticateUser');



router.post('/register',regUser);

router.post('/login',logInUser);

router.post('/password/forgot',forgetPsw);

router.put('/password/reset/:token',resetPsw);

router.post('/logout',logoutUser);

//user profile and info

router.get('/user',authUser,getUserData);

router.put('/password/update',authUser,updatePassword);

router.put('/user/update',authUser,updateProfile);


//admin accessing profiles of users

router.get('/admin/users',authUser,roleAuth('admin'),getAllUsers);

router.get('/admin/user/:id',authUser,roleAuth('admin'),getAUserForAdmin);


router.put('/admin/user/:id',authUser,roleAuth('admin'),updateUserRole);


router.delete('/admin/user/:id',authUser,roleAuth('admin'),deleteUser);





module.exports=router;