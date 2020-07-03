const Post=require('../Models/posts.js');
const User=require('../Models/user');

//Format: module.exports.actionName = function(req,res){}

module.exports.home=async function(req,res) {
    
    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title: 'SocioPolis | Home',
    //         posts: posts
    //     })
    // })

    try{
        //populate the user of each post
    let posts=await Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path:'user'
        }
    });
    
    let users=await User.find({});

    return res.render('home',{
        title: 'SocioPolis | Home',
        posts: posts,
        all_users: users
    });

    }catch(err){
        console.log("Error"+err);
        return;
    }
    
}


