const express=require('express');

const Router= express.Router();
const Passport=require('passport');

const postsApi=require('../../../Controllers/api/v1/posts_api');

Router.get('/',postsApi.index);

//to prevent the creation of session cookies, we have set session to false 
Router.delete('/:id',Passport.authenticate('jwt',{session:false}),postsApi.destroy);


module.exports= Router;