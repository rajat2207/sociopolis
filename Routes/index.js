const express=require('express');

const Router= express.Router();
const homeController = require('../Controllers/home_controllers');

//to check whether router is working or not
console.log("Router loaded");

//for any further routes, access from here
//Router.use('/routername',require('filename'));

Router.get('/',homeController.home);
Router.use('/users',require('./users'));
Router.use('/posts',require('./posts'));
Router.use('/comments',require('./comments'));

Router.use('/api',require('./api'));

module.exports= Router;