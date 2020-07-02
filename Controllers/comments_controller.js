const Comment= require('../Models/comment');
const Post=require('../Models/posts');


module.exports.create= function(req,res){
    Post.findById(req.body.post,function (err,post) {
        
        if(post){
            Comment.create({
                //creating the comment
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            },function(err,comment){
                // updating the post and adding the comment to it
                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
        }
    });
}