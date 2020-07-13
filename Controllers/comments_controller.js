const Comment= require('../Models/comment');
const Post=require('../Models/posts');
const commentsMailer=require('../mailer/comments_mailer');
const commentEmailWorker=require('../workers/comment_email_worker');
const queue=require('../Config/kue');

module.exports.create = async function(req,res){
    
    try{
        let post= await Post.findById(req.body.post);
        
            if(post){
                let comment=await Comment.create({
                    //creating the comment
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });
                    // updating the post and adding the comment to it
                post.comments.push(comment);
                post.save();
                
                comment= await comment.populate('user','name email').execPopulate();
                // commentsMailer.newComment(comment);
                let job = queue.create('emails',comment).save(function(err){
                    if(err){
                        console.log("Error in sending to the queue", err);
                        return;
                    }

                    console.log("Job enqueued ",job.id);
                });

                if(req.xhr){

                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message: "Comment Created!"
                    });
                }
    
                res.redirect('/');
                
            }
    }catch(err){
        req.flash('error',err)
    }
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

                    req.flash('success',"Comment Deleted!");
                    return res.redirect('back');
                });
            }else{
                req.flash('error','You are not authorized');
                return res.redirect('back');
            }
    });
}