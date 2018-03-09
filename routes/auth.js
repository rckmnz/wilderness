const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    middleware = require("../middleware/index");
User = require("../models/user");

//===============================
// AUTH ROUTES
//===============================

// show register form
router.get("/register", (req, res) => {
    res.render("register", {message:req.flash("error")});
});

// sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    if (req.body.adminCode === "secretcode123") {
        newUser.isAdmin = true; 
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {
    });

// logout logic
router.get("/logout", middleware.isLoggedIn,(req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;

