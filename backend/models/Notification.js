const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
    fromUserId: { type: String, required: true },
    fromUsername: { type: String, required: true },
    fromProfilePic: { type: String, default: "" },
    postId: { type: String },
    postImage: { type: String },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);