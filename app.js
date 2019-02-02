var express = require("express"),
    app = express(),
    User = require("./models/user"),
    bodyParser  = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/fan_club', {useNewUrlParser: true});
// seedDb();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// configure passport
app.use(require("express-session")({
    secret: "This is the fan club of mby",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// set locals, give all ejs access to req.user
// must be in front of import routes
app.use(function(req, res, next){
    res.locals.curUser = req.user;
    next();
 });

// import routes
var indexRoutes = require("./routes/index"),
    subjectRoutes = require("./routes/subjects"),
    userRoutes = require("./routes/users"),
    resourcesRoutes = require("./routes/resources");
app.use(indexRoutes);
app.use(subjectRoutes);
app.use(userRoutes);
app.use(resourcesRoutes);





app.listen(3000, "localhost", function(){
    console.log("Server started, listening on port 3000");
});