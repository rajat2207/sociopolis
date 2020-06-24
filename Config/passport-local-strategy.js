const user = require('../models/user'); 

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;


// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    },
    function (email,password,done) {
        //find a user and establish identity
        user.findOne({email:email},function (err,user) {
            if(err){
                console.log("Error in finding the user--> Passport");
                return done(err);
            }

            if(!user || user.password!=password){
                console.log("Invalid Username/Password");
                return done(null,false);
            }

            return done(null,user);
        });
    }
));

//serializing from the user to decide which key is to be kept in cookies
passport.serializeUser(function (user,done) {
    done(null,user.id);
})


//deserialing the user from the cookies
passport.deserializeUser(function(id,done){
    user.findById(id,function(err,user){
        if(err){
            console.log("Error in finding the user--> Passport");
            return done(err);
        }
        return done(null,user);
    })
}) 

module.exports = passport;
