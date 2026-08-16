const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    fullName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    coverPic: {
        type: String,
        default: "https://images.unsplash.com/photo-1614850523296-e8c0d9732391?q=80&w=1000&auto=format&fit=crop"
    },
    bio: {
        type: String,
        max: 150,
        default: "Welcome to my Tonogram profile!"
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    savedPosts: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);