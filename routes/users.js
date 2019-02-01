var express = require("express"),
    router = express.Router(),
    User = require("../models/user")
    request = require("request")

router.get("/users/:id", function(req, res){
    User.findById(req.params.id).populate("subjects posts").exec(function(err, user){
        res.render("users/userInfo", {user: user});
    });
});

router.post("/users/:id/avatar", function(req, res){
    var clientId = "8ae2612bf7cb691";

    request({
        // delete the old avatar from imgur
        method: "DELETE",
        url: "https://api.imgur.com/3/image/" + req.user.avatarDeleteHash,
        headers: {
            "Authorization": "Client-ID " + clientId
        }
    }, function(err, ress, body){
        console.log(err);
        console.log(body);

        // change the url and deleteHash in local database
        req.user.avatarUrl = req.body.avatarUrl;
        req.user.avatarDeleteHash = req.body.avatarDeleteHash;
        req.user.save();
        res.redirect("/users/" + req.params.id);
    });

    
});

module.exports = router;