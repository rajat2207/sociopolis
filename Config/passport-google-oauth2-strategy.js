const passport=require('passport');
const env=require('./environment');
const GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');

const User=require('../Models/user');


//tell passport to use a new Strategy for google login
passport.use(new GoogleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_URL
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