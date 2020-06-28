const express = require('express');

const router = express.Router();

const postsController= require('../Controllers/posts_controllers');

router.post('/create',postsController.create);

module.exports=router;