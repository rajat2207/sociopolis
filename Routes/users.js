const express=require('express');

const router=express.Router();

const usersController = require('../Controllers/users_controller');

router.get('/profile',usersController.profile);
router.get('/',usersController.users);
router.get('/sign_in',usersController.signIn);
router.get('/sign_up',usersController.signUp);

module.exports = router;