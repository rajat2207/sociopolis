const express=require('express');

const router=express.Router();

const passport = require('passport');


const usersController = require('../Controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);


router.get('/sign-in',usersController.signIn);
router.get('/sign-up',usersController.signUp);

//password reset links
router.get('/password-reset',usersController.passwordResetPage);
router.post('/password-reset',usersController.passwordReset);
router.get('/password-reset/done',usersController.passwordResetDone);
router.get('/password-reset/:token',usersController.changePasswordPage);
router.post('/password-reset/:token',usersController.changePassword);

router.post('/create',usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/sign-out',usersController.destroySession);

//scope is the information we want to fetch from google
router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));
router.get('auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

module.exports = router;