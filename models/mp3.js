var mongoose = require("mongoose");

var mp3Schema = new mongoose.Schema({
    name: String,
    downloadTimes: Number
});

module.exports = mongoose.model("Mp3", mp3Schema);
