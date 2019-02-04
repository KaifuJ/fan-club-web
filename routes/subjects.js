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
        user: req.user._id,
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
        var page = req.query.page;
        if(page){
            page = parseInt(req.query.page);
        }else{
            page = 1;
        }
        
        var totalNum = subjs.length;
        var totalPages = Math.ceil(totalNum / 20);
        subjs = subjs.slice(20 * (page - 1), 20 * page);
        res.render("subjects/allSubjects", {
            subjects: subjs, 
            totalPages: totalPages,
            page: page
        });
    });
});

// one subject show page
router.get("/subjects/:id", function(req, res){
    Subject.findById(req.params.id)
    .populate("user", "avatarUrl username")
    .populate({
        path: "posts",
        Model: "Post",
        select: "user content",
        populate:{
            path: "user",
            model: "User",
            select: "username avatarUrl"
        }
    })
    .exec(function(err, subj){
        // console.log(subj);
        var page = req.query.page;
        if(page){
            page = parseInt(req.query.page);
        }else{
            page = 1;
        }

        var totalNum = subj.posts.length;
        var totalPages = Math.ceil(totalNum / 10);
        subj.posts = subj.posts.slice(10 * (page - 1), 10 * page);

        res.render("subjects/subject", {
            subject: subj, 
            totalPages: totalPages,
            page: page
        });
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
            user: req.user._id,
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