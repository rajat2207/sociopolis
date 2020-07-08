const express=require('express');

const Router= express.Router();

Router.use('/v1',require('./v1'));
Router.use('/v2',require('./v2'));

module.exports= Router;