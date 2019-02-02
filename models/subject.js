var mongoose = require("mongoose");

var subjectSchema = mongoose.Schema({
    title: String,
    content: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        avatarUrl: String,
        username: String
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
},{
    timestamps: true
});

module.exports = mongoose.model("Subject", subjectSchema);
