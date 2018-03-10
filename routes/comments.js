const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index");


// ===========================
// COMMENTS ROUTES
// ===========================

// NEW - Comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground
            });
        }
    });
});

//POST - Comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    // lookup campground using Id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // add username id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// EDIT - Comment
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            } else {
                res.render("comments/edit", {
                    campground_id: req.params.id,
                    comment: foundComment
                });
            }
        });
    });
});

// UPDATE - Comment
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - Comment
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;