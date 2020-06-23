module.exports.profile=function (req,res) {
    res.render('profile',{
        'title' : 'Profile'
    })
}

module.exports.users=function (req,res) {
    res.render('users',{
        'title': 'users'
    });
}

//render the sign in page
module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
        'title' : 'SocioPolis | Sign In'
    });
}

//render the sign up page
module.exports.signUp=function (req,res) {
    return res.render('user_sign_up',{
        'title': 'SocioPolis | Sign Up'
    })
    
}