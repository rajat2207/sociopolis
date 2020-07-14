const Like=require('../Models/likes');
const Post=require('../Models/posts');
const Comment=require('../Models/comment');


module.exports.toggleLike=async function(req,res){
    try{

        //likes/toggle/?id=abc&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type=='Post'){
            likeable = await Post.findById(req.query.id).populate('Likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('Likes');
        }


        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user: req.user._id
        })

        //if a like already exists delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted=true;

        }else{
            //else make a new like

            let newLike = await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type
            }) 

            likeable.likes.push(newLike);

            likeable.save();

            return res.json(200,{
                message: "Request Successful"
            });
        }

    }catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        })
    }
}