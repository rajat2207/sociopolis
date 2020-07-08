const express=require('express');

const Router= express.Router();

Router.use('/posts',require('./posts'));

module.exports= Router;