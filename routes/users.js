var express = require("express"),
    router = express.Router(),
    User = require("../models/user")

router.get("/users/:id", function(req, res){
    User.findById(req.params.id).populate("subjects posts").exec(function(err, user){
        res.render("users/userInfo", {user: user});
    });
});

router.post("/users/:id/avatar", function(req, res){
    req.user.avatarUrl = req.body.avatarUrl;
    req.user.avatarDeleteHash = req.body.avatarDeleteHash;
    req.user.save();
    res.redirect("/users/" + req.params.id);
});

module.exports = router;