var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport"),
    Subject = require("../models/subject"),
    Mp3 = require("../models/mp3")

function processMp3Name(name){
    var first = name.substring(0, 1);
    if(isNaN(first)){
        return name.substring(0, name.length - 4);
    }else{
        var num = name.substring(0, name.indexOf(". "));
        return name.substring(name.indexOf(". ") + 2, name.length - 4) + "\xa0\xa0\xa0( " + num + " )";
    }
}

// landing page
router.get("/", function(req, res){
    res.render("landing")
});

// home page
router.get("/home", function(req, res){
    Subject.find({}).sort("-updatedAt").limit(10).exec(function(err, subjs){
        Mp3.find({}).sort("-downloadTimes").limit(9).exec(function(err, mp3s){
            mp3s.forEach(function(mp3){
                mp3.name = processMp3Name(mp3.name);
            });
            res.render("home", {
                subjects: subjs,
                mp3s: mp3s
            });
        })
    })
});

// signup page
router.get("/signup", function(req, res){
    res.render("signup");
});

// create new user
router.post("/signup", function(req, res){
    User.find({
        $or: [{"username": req.body.username}, {"email": req.body.email}]
    }, function(err, users){
        if(users.length === 0){
            var newUser = new User({
                username: req.body.username,
                email: req.body.email,
                credits: 5,
                avatarUrl: "https://i.imgur.com/ywl6mLK.png",
                avatarDeleteHash: ""
            });

            User.register(newUser, req.body.password, function(err, user){
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/home");
                });
            });
        }else{
            console.log("user exists");
        }
    });
});

// login page
router.get("/login", function(req, res){
    res.render("login");
});

// handle login request
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/home",
    failureRedirect: "/login"
    // failureFlash: true,
    // successFlash: 'Welcome to YelpCamp!'
}), function(req, res){
});

// logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home");
})

module.exports = router;
