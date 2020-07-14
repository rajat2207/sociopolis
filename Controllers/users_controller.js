const User= require('../Models/user.js')
const Token=require('../Models/token.js')
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const passwordResetMailer=require('../mailer/password_reset_mailer');
const passwordResetWorker=require('../workers/password_reset_worker');
const queue=require('../Config/kue');

//lets dont add async await in this conr=troller and keep it same for future reference

//render the profile page
module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){

        return res.render('user_profile',{
            'title': 'SocioPolis | Profile',
            'profile_user':user
        });

    });
}

//update the user info
module.exports.update= async function(req,res){
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){

    //         req.flash('success','Profile Updated')

    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorised');
    // }

    if(req.user.id==req.params.id){
        
        try{
            
            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('****Multer Error****:',err);
                }
                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    //this is saving the path of the uploaded file into the avatar feild in the user
                    user.avatar=User.avatarPath+'/'+req.file.filename;
                }
                user.save();

                req.flash('success','Profile Updated');

                return res.redirect('back');
            });

        }catch{
            req.flash('error',err);
            return res.redirect('back');
        }

    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorised');
    }
}

//render the sign in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        'title' : 'SocioPolis | Sign In'
    });
}

//render the sign up page
module.exports.signUp=function (req,res) {

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        'title': 'SocioPolis | Sign Up'
    })
    
}

//create a new account in the datatbase
module.exports.create=function(req,res) {
    if(req.body.password!=req.body.confirm_password){
        
        req.flash('warning',"passwords don't match!")

        return res.redirect('back');
    }

    User.findOne({email: req.body.email},function (err,user) {
        if(err){
            req.flash('error',err);
            return;
        }

        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    req.flash('error','error in creating the user in signing up');
                    return;
                }

                //create token for later use
                Token.create({
                    user : user,
                    resetToken : crypto.randomBytes(20).toString('hex'),
                    isValid : true
                },function(err,token){
                    if(err){
                        console.log('error in creating the token in signing up',err);
                        return
                    }
                    console.log("token successfully created");
                });

                req.flash('success','Accout Successfully Created!')
                return res.redirect('/users/sign-in')
            })
        }else{

            req.flash('error','Username already in use');
            return res.redirect('back');
        }
        
    })
}

//sign in and create a session for the user
module.exports.createSession= function (req,res) {
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
}

module.exports.destroySession= function (req,res) {
    req.logout();
    req.flash('success', 'You have been Logged Out');
    return res.redirect('/');
}

module.exports.passwordResetPage= function(req,res){
    return res.render('password_reset',{
        title:'SocioPolis | Password Reset'
    })
}

module.exports.passwordReset= async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});

        if(user){
            let token=await Token.findOne({user : user,isValid : true});
            
            token= await token.populate('user','name email').execPopulate();

            let job =await queue.create('password_reset_emails',token).priority('critical').save(function(err){
                if(err){
                    console.log("Error in sending to the queue", err);
                    return;
                }

                console.log("Job enqueued ",job.id);
            });

            return res.redirect('/users/password-reset/done');
        }
        else{
            req.flash('error','User does not exist!');
            return res.redirect('back');
        }

    }catch(err){
        console.log("Error during password Reset",err);
        return res.redirect('back');
    }
    
}

// render the reset done page
module.exports.passwordResetDone = function(req,res){
    return res.render('password_reset_done',{
        title:'SocioPolis | Password Reset'
    })
}

//render the change password page
module.exports.changePasswordPage = function(req,res){

    Token.findOne({resetToken : req.params.token},function(err,token){
        if(err){
            console.log("Error in finding the token during password change", err);
        }
        if(token){
            if(token.isValid==true){
                return res.render('change_password',{
                    title : 'SocioPolis | Password Reset',
                    token : token.resetToken
                })
            }else{
                return res.render('change_password_fail',{
                    title:'SocioPolis | Password Reset'
                })
            }
        }else{
            req.flash('warning','You are not authorised!');
            res.redirect('back');
        }
    });
}

module.exports.changePassword = async function(req,res){

    if(req.body.new_password==req.body.confirm_password){
        try{
            let token=await Token.findOne({resetToken : req.params.token, isValid:true});

            let tokenUser=token.user;

            let user=await User.findById(tokenUser._id);

            user.password=req.body.new_password;

            user.save();

            token.isValid=false;

            token.save();

            let newToken= Token.create({
                user : user,
                resetToken : crypto.randomBytes(20).toString('hex'),
                isValid : true
            })
        }catch(err){
            console.log("error", err);
            return;
        }

    }else{
        req.flash('warning',"Passwords don't match!");
        return res.redirect('back');
    }
}