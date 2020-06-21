const express=require('express');

const Router= express.Router();
const homeController = require('../Controllers/home_controllers');

//to check whether router is working or not
console.log("Router loaded");

Router.get('/',homeController.home);

module.exports= Router;