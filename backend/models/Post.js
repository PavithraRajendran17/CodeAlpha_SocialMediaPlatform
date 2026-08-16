const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    desc: { type: String, max: 500 },
    img: { type: String },
    likes: { type: Array, default: [] },
    comments: [{
        userId: String,
        username: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    savedBy: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);