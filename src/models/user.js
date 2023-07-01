const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

mongoose.connect("mongodb://localhost/CloudFile", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    googleId: String,
    Files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CloudFile"
    }]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("CloudUser", userSchema);
exports.User = User;
