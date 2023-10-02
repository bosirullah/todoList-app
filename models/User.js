const mongoose = require("mongoose"); 
const passportLocalMongoose = require("passport-local-mongoose"); // Import passport-local-mongoose for simplifying Passport.js integration

const userSchema = new mongoose.Schema({
    username: String,
    password: String, // This will be handled by passport-local-mongoose
    // Note: The actual password hashing and authentication logic will be handled by passport-local-mongoose
});

// Use passport-local-mongoose as a plugin to your schema to extend the schema with additional functionality
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
