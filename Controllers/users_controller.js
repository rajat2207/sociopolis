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