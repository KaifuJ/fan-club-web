var mongoose = require("mongoose");

var subjectSchema = mongoose.Schema({
    title: String,
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
},{
    timestamps: true
});

module.exports = mongoose.model("Subject", subjectSchema);
