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

module.exports = middleware;