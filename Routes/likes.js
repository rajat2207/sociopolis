const express = require('express');
const router = express.Router();

const likesController= require('../Controllers/likes_controllers');

router.post('/toggle',likesController.toggleLike);

module.exports=router;