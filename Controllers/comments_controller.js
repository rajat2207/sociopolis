const Comment= require('../Models/comment');
const Post=require('../Models/posts');

//lets dont add async await and keep it the same for future reference


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

module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
            if(comment.user==req.user.id){
                
                let postId = comment.post;
                
                comment.remove();

                Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id }},function(err,post){
                    return res.redirect('back');
                });
            }else{
                return res.redirect('back');
            }
    });
}