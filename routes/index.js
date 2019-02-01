var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport")

// landing page
router.get("/", function(req, res){
    res.render("landing")
});

// home page
router.get("/home", function(req, res){
    res.render("home");
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
                avatarUrl: "https://i.imgur.com/0wc8tkU.png",
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
    res.redirect("back");
})

module.exports = router;
