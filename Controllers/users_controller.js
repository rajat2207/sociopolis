const User= require('../Models/user.js')

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