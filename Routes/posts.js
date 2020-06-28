const express = require('express');
const router = express.Router();
const passport=require('passport');

const postsController= require('../Controllers/posts_controllers');

router.post('/create',passport.checkAuthentication,postsController.create);

module.exports=router;