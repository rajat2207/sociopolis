const express = require('express');

const router = express.Router();

const postsController= require('../Controllers/posts_controllers');

router.get('/',postsController.posts);

module.exports=router;