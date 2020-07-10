const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');

const User=require('../Models/user');


//tell passport to use a new Strategy for google login
passport.use(new GoogleStrategy({
        clientID:"1001043350512-2bkr91d6cb9o0ruov90lc0oufbftdru1.apps.googleusercontent.com",
        clientSecret:"a1ZtpTxJ10dB-Qx4aWYHW32u",
        callbackURL:"http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken,refreshToken,profile,done){
        //find a user 
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("err in google strategy",err);
                return;
            }

            console.log(profile);

            if(user){
                //if found,set this user as req.user
                return done(null,user);
            }else{
                //if not found create the user and set it as req.user(sign in the user)
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){
                        console.log("err in creating the user in google strategy",err);
                        return;
                    }  

                    return done(null,user);
                });
            }
        });
    }
));

module.exports=passport;