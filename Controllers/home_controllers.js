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
        // CHANGE :: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');

    
        let users = await User.find({});

        return res.render('home', {
            title: "SocioPolis | Home",
            posts:  posts,
            all_users: users
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
    
}


