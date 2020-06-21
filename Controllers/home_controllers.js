//Format: module.exports.actionName = function(req,res){}

module.exports.home=function(req,res){
    return res.end('<h1>Express is up for Codeial</h1>')
}

module.exports.home2=function(req,res){
    return res.end('<h1>My homepage</h1>')
}

