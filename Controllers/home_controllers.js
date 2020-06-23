//Format: module.exports.actionName = function(req,res){}

module.exports.home=function(req,res){
    return res.render('sign_in',{
        'title' : 'Sign In'
    });
}


