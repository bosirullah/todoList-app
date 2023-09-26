const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String, // This will be handled by passport-local-mongoose
});

// Use passport-local-mongoose as a plugin to your schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
