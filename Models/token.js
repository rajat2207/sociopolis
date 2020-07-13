const mongoose=require('mongoose');


const tokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    token:{
        type : String,
        required : true
    },
    isValid:{
        type : Boolean,
        required : true
    }
},{
    timestamps: true
});