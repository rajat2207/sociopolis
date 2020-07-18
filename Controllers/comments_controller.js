const Comment= require('../Models/comment');
const Post=require('../Models/posts');
const Like = require('../Models/likes');
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
                let job = queue.create('comments_emails',comment).priority('medium').save(function(err){
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
        return;
    }
}

module.exports.destroy= async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
}