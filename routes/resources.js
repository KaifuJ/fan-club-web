var express = require("express"),
    router = express.Router(),
    middleware = require("../middlewares"),
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

router.get("/resources", function(req, res){
    Mp3.find({}).sort("-downloadTimes").exec(function(err, allMp3){
        var page = req.query.page;
        if(page){
            page = parseInt(req.query.page);
        }else{
            page = 1;
        }

        var totalNum = allMp3.length;
        var totalPages = Math.ceil(totalNum / 30);
        allMp3 = allMp3.slice(30 * (page - 1), 30 * page);
        allMp3.forEach(function(mp3){
            mp3.name = processMp3Name(mp3.name);
        });
        res.render("resources/resources", {
            allMp3: allMp3, 
            totalPages: totalPages,
            page: page
        });
    });
});

router.get("/resources/mp3/:id", middleware.canDownload, function(req, res){
    Mp3.findById(req.params.id, function(err, mp3){
        mp3.downloadTimes = mp3.downloadTimes + 1;
        mp3.save();
        res.download("E:/mby/" + mp3.name);
    });
});

module.exports = router;