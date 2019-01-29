var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    subject: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject"
        },
        title: String
    },
    content: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);
