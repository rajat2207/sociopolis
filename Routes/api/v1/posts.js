const express=require('express');

const Router= express.Router();

const postsApi=require('../../../Controllers/api/v1/posts_api');

Router.get('/',postsApi.index);
Router.delete('/:id',postsApi.destroy);

module.exports= Router;