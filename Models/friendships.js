const mongoose=require('mongoose');

const friendshipSchema=new mongoose.Schema({
    //the user who sent this request
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //the user to whom this request was sent
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps:true
});

const Friendship = mongoose.Model('Friendship',friendshipSchema);

module.exports=Friendship;