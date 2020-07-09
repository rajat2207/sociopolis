const express=require('express');

const Router= express.Router();

const usersAPI=require('../../../Controllers/api/v1/users_api');


Router.post('/create-session',usersAPI.createSession);

module.exports= Router;