var express = require("express"),
    router = express.Router(),
    Subject = require("../models/subject"),
    Post = require("../models/post"),
    middleware = require("../middlewares"),
    User = require("../models/user")

// create a new subject
router.post("/subjects", middleware.isLoggedIn, function(req, res){
    Subject.create({
        title: req.body.subjectTitle,
        content: req.body.subjectContent,
        user:{
            id: req.user._id,
            avatarUrl: req.user.avatarUrl,
            username: req.user.username
        },
        posts: []
    }, function(err, subj){
        console.log(subj);
        req.user.subjects.push(subj._id);
        req.user.save();
    });
    res.redirect("back");
});

// all subjects page
router.get("/subjects/all", function(req, res){
    Subject.find({}).sort("-updatedAt").exec(function(err, subjs){
        res.render("subjects/allSubjects", {subjects: subjs});
    });
});

// one subject show page
router.get("/subjects/:id", function(req, res){
    Subject.findById(req.params.id).populate("posts").exec(function(err, subj){
        res.render("subjects/subject", {subject: subj});
    });
});

// create a new post for a subject
router.post("/subjects/:id/posts", middleware.isLoggedIn, function(req, res){
    // if(req.body.postContent === "")
    Subject.findById(req.params.id, function(err, subj){
        Post.create({
            subject:{
                id: subj._id,
                title: subj.title
            },
            user: {
                id: req.user._id,
                avatarUrl: req.user.avatarUrl,
                username: req.user.username
            },
            content: req.body.postContent
        }, function(err, post){
            subj.posts.push(post._id);
            subj.save();
            req.user.posts.push(post._id);
            req.user.save();
        });
    });
    res.redirect("/subjects/" + req.params.id);
});

module.exports = router;