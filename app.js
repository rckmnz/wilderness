require('dotenv').config()

// PACKAGES
const
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    flash = require("connect-flash");

// MODULES
const
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth"),
    User = require("./models/user"),
    seedDB = require("./seeds");


//=============================
// DB SETUP
//=============================
//mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.connect("mongodb://rckmnz:0907792@ds121896.mlab.com:21896/yelpcamp");

//=============================
// APP SETUP
//=============================
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //Seed the DB

// Moment.js
app.locals.moment = require('moment');

//=============================
// PASSPORT SETUP
//=============================
app.use(expressSession({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass current user (req.user) to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//=============================
// ROUTES SETUP
//=============================
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(authRoutes);


//=============================
// SERVER SETUP
//=============================
app.listen(process.env.PORT || 3000, () => {
    console.log("Server initialized on port 3000.")
});