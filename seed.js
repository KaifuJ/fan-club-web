var mongoose = require("mongoose");
var Subject = require("./models/subject");
var Post = require("./models/post");

var subjs = [
    {
        title: "maobuyi",
        content: "when will he hold a concert?",
        posts:[]
    },
    {
        title: "maobuyi",
        content: "when will he hold a concert?",
        posts:[]
    },
    {
        title: "maobuyi",
        content: "when will he hold a concert?",
        posts:[]
    }
]

function seedDb(){
    Post.remove({}, function(err){
        console.log("removed all posts");
    });
    Subject.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed subjs");
        subjs.forEach(function(subj){
            Subject.create(subj, function(err, subj){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a subject");
                    Post.create({
                        subject: {
                            id: subj,
                            title: "maobuyi"
                        },
                        content: "this is a following post"
                    }, function(err, post){
                        subj.posts.push(post);
                        subj.save();
                        console.log("added a following post");
                    });
                }
            });
        });
    });
}

module.exports = seedDb;