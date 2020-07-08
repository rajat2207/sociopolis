module.exports.index = function(req,res){
    return res.json(200, {
        Message: "List Of Posts",
        posts:{}
    })
};