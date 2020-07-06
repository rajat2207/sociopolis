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

                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message: "Comment Created!"
                    });
                }

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

                    if(req.xhr){
                        return res.status(200).json({
                            data:{
                                comment_id:req.params.id
                            },
                            message: "Comment Deleted!"
                        });
                    };

                    req.flash('success',"Comment successfully removed");
                    return res.redirect('back');
                });
            }else{
                req.flash('error','You are not authorized');
                return res.redirect('back');
            }
    });
}