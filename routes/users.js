var express = require("express"),
    router = express.Router(),
    User = require("../models/user")
    request = require("request"),
    middleware = require("../middlewares")

router.get("/users/:id", function(req, res){
    User.findById(req.params.id).populate("subjects posts").exec(function(err, user){
        res.render("users/userInfo", {user: user});
    });
});

router.post("/users/:id/avatar", middleware.isCurUser, function(req, res){
    var clientId = "8ae2612bf7cb691";
    var oldDeleteHash = req.user.avatarDeleteHash;

    // change the url and deleteHash in local database
    req.user.avatarUrl = req.body.avatarUrl;
    req.user.avatarDeleteHash = req.body.avatarDeleteHash;
    req.user.save();

    if(oldDeleteHash !== ""){ // if the old avatar is not default avatar
        request({
            // delete the old avatar from imgur
            method: "DELETE",
            url: "https://api.imgur.com/3/image/" + oldDeleteHash,
            headers: {
                "Authorization": "Client-ID " + clientId
            }
        }, function(err, ress, body){
            console.log(err);
            console.log(body);
            res.redirect("/users/" + req.params.id);
        });
    }else{
        res.redirect("/users/" + req.params.id);
    }
});

module.exports = router;