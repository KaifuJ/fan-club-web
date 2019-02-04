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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);
