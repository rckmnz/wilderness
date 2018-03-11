const
    express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index"),
    NodeGeocoder = require('node-geocoder'),
    multer = require('multer'),
    cloudinary = require('cloudinary');

// =========================== 
// GEOCODER CONFIG
// ===========================
const options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null
    },
    geocoder = NodeGeocoder(options);

// ===========================
// MULTER & CLOUDINARY CONFIG
// ===========================
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});
const imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({
    storage: storage,
    fileFilter: imageFilter
})

cloudinary.config({
    cloud_name: 'dotgihste',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ===========================
// MAIN ROUTES
// ===========================

// Landing Page
router.get("/", (req, res) => {
    res.render("landing");
});


// INDEX - show all campgrounds
router.get("/campgrounds", (req, res) => {
    let noMatch;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        // Get all campgrounds from DB
        Campground.find({
            name: regex
        }, (err, allCampgrounds) => {
            if (err) {
                console.log(err);
            } else {

                if (allCampgrounds.length < 1) {
                    noMatch = "No Campgrounds match that query, please try again!"
                }
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    currentUser: req.user,
                    noMatch: noMatch
                });
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    currentUser: req.user,
                    noMatch: noMatch
                });
            }
        });
    }
});


// CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, upload.single('image'), (req, res) => {
    // Get data from form and add to campgrounds array
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    // Get geolocation
    geocoder.geocode(req.body.location, (err, data) => {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        let lat = data[0].latitude;
        let lng = data[0].longitude;
        let location = data[0].formattedAddress;

        let newCampground = {
            name,
            price,
            image,
            description: desc,
            author,
            location,
            lat,
            lng
        };
        // add cloudinary url for the image to the campground object under image property
        cloudinary.uploader.upload(req.file.path, (result) => {
            req.body.campground.image = result.secure_url;
            // add author to campground
            req.body.campground.author = {
                id: req.user._id,
                username: req.user.username
            }
            // Create a new campground and save to DB
            Campground.create(newCampground, (err, campground) => {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                // Redirect back to campgrounds page
                res.redirect("/campgrounds");
            });
        });
    });
});


// NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});


// SHOW - shows information about one specific campground
router.get("/campgrounds/:id", (req, res) => {
    // Find the campground with provided ID
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash("error", "Something went wrong!");
                console.log(err);
                res.redirect("back");
            } else {
                console.log(foundCampground);
                // Render show template with that campground
                res.render("campgrounds/show", {
                    campground: foundCampground
                });
            }
        });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {
                campground: foundCampground
            });
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.location, (err, data) => {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        let lat = data[0].latitude;
        let lng = data[0].longitude;
        let location = data[0].formattedAddress;
        let newData = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            location: location,
            lat: lat,
            lng: lng
        };
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
            if (err) {
                req.flash("error", "Something went wrong!");
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "The campground was updated successfully!");
                res.redirect("/campgrounds/" + updatedCampground._id);
            }
        });
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "The campground was deleted successfully!");
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;