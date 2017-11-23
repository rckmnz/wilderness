const mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

let data = [
    {
        name: "Woodland Park",
        image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?auto=format&fit=crop&w=1650&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Snackwave lo-fi pok pok, selfies hammock polaroid neutra umami fingerstache viral pop-up hashtag 90's direct trade plaid. +1 mixtape everyday carry hammock chicharrones biodiesel raw denim man bun plaid cred irony cardigan hoodie. Pour-over trust fund literally woke scenester meh fixie fanny pack vaporware gastropub banjo cornhole. Squid cold-pressed meh, ennui trust fund drinking vinegar actually four loko. Vape shaman blue bottle, man braid iceland intelligentsia poutine. Migas thundercats pop-up cardigan, green juice taiyaki sustainable salvia you probably haven't heard of them tumeric. Vape fixie viral cornhole fanny pack craft beer vexillologist snackwave deep v. Af raclette prism hashtag sriracha fingerstache. Enamel pin shaman plaid, 3 wolf moon lyft mustache sartorial palo santo pickled raw denim disrupt tousled."
    },
    {
        name: "Perry's Lookdown",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1249&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Keytar ramps selfies enamel pin cornhole. Ramps pour-over gochujang VHS artisan direct trade. Mlkshk farm-to-table thundercats post-ironic whatever iPhone. Vegan fashion axe chicharrones mlkshk skateboard. Mumblecore vexillologist tousled taxidermy scenester af. Cred enamel pin woke lomo mustache poutine kale chips, raw denim humblebrag banh mi deep v venmo. Stumptown sustainable copper mug chia pitchfork. Shoreditch quinoa chicharrones ethical glossier. Semiotics brooklyn unicorn enamel pin tilde farm-to-table distillery, glossier heirloom. Fam bicycle rights snackwave, church-key small batch seitan skateboard organic food truck venmo hexagon."
    },
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1495613455702-836d1327ebc6?auto=format&fit=crop&w=1780&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        description: "Literally green juice migas fanny pack hot chicken. Forage kinfolk hashtag plaid. Man braid bicycle rights roof party, poke slow-carb copper mug mlkshk occupy deep v cred beard waistcoat shoreditch meggings. Pug yuccie salvia kinfolk hoodie, helvetica letterpress heirloom retro portland leggings woke kitsch skateboard chillwave. Etsy everyday carry tbh waistcoat semiotics pinterest ennui seitan. Yuccie tilde lomo wolf XOXO poke. Ugh palo santo raw denim schlitz, keffiyeh subway tile migas tacos stumptown everyday carry echo park. Four loko synth literally kombucha meggings. Portland kitsch pop-up, church-key chambray snackwave raclette direct trade tilde unicorn. Jean shorts shoreditch banh mi fixie copper mug bicycle rights ethical fanny pack waistcoat. PBR&B messenger bag cliche, kitsch lo-fi unicorn chillwave pinterest truffaut beard. Cold-pressed you probably haven't heard of them neutra, salvia pug live-edge trust fund pour-over everyday carry brunch swag. Pok pok blue bottle ugh normcore shaman. Man bun tacos skateboard, live-edge plaid flexitarian hexagon banh mi vinyl sriracha lumbersexual pork belly. Yr semiotics intelligentsia subway tile prism, helvetica twee chicharrones pabst thundercats keffiyeh bespoke."
    }
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, err => {
            if (err) {
                console.log(err);
            } else {
                console.log("Removed previous campgrounds!");
                // // Add Campgrounds
                // data.forEach(seed => {
                //     Campground.create(seed, (err, campground) => {
                //         if (err) {
                //             console.log(err);
                //         } else {
                //             console.log(`Added ${campground}!`);
                //             Comment.create(
                //                 {
                //                     text: "This place is great but no WI-FI!",
                //                     author: "Homer"
                //                 }, (err, comment) => {
                //                     if (err) {
                //                         console.log(err);
                //                     } else {
                //                         campground.comments.push(comment);
                //                         campground.save();
                //                         console.log("Created new comment")
            }
        }
    )
// }
    //             });
    //
    //         });
    //     }
    // });

}

module.exports = seedDB;