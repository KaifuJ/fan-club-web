var middleware = {}

middleware.isLoggedIn = function(req, res, next){
    if(req.user){
        next();
    }else{
        res.redirect("/login");
    }
};

middleware.isCurUser = function(req, res, next){
    if(req.user && req.user._id.equals(req.params.id)){
        next();
    }
}

middleware.canDownload = function(req, res, next){
    if(!req.user){
        res.redirect("/login");
    }else if(req.user.credits < 3){
        res.send("下载歌曲需要扣除 3 积分，您当前积分不足");
    }else{
        req.user.credits = req.user.credits - 3;
        req.user.save();
        next();
    }
}

module.exports = middleware;