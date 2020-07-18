
const User=require('../../../Models/user');
const JWT=require('jsonwebtoken');
const env=require('../../../Config/environment');

//sign in and create a session for the user
module.exports.createSession = async function (req,res) {
    
    try{
        
        let user= await User.findOne({email: req.body.email});

        if(!user||user.password!=req.body.password){
            return res.json(422, {
                message : "Invalid Username/Password"
            });
        }   

        return res.json(200,{
            message: 'Sign in successful, here is your token, please keep it safe',
            data:{
                token: JWT.sign(user.toJSON(), env.jwt_secret_key, {expiresIn: '100000'})
            }
        })
    
    }catch(err){
        
        console.log('*******',err);

        return res.json(500,{
            message: "Internal server error"
        });

    }

}