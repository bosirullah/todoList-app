const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.get("/", function(req, res) {
    res.render("login");
});


router.get("/login",(req,res)=>{
    res.render("login");
})

router.get("/register",(req,res)=>{
    res.render("register");
})

// Registration route
router.post("/register", (req, res) => {
    const { username, password } = req.body;
    User.register(new User({ username }), password, (err, user) => {
        if (err) {
            console.error(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/dashboard"); // Redirect after successful registration
        });
    });
});

  // Login route
router.post("/login",passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    }),(req, res) => {}
);

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

router.post("/logout", function(req, res) {
    // Perform logout logic, e.g., destroy the session
    req.logout(function(err) {
        if (err) {
            console.error(err);
        }
        // Redirect the user to the login page
        res.redirect("/login");
    }); 
});


module.exports = router;
