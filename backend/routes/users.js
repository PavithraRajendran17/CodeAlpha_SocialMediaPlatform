const User = require("../models/User");
const router = require("express").Router();

// --- SPECIFIC ROUTES FIRST (to avoid conflicts) ---

// --- 1. GET USER BY USERNAME ---
router.get("/username/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json("User not found!");
        
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 2. GET ALL USERS (Search/Suggestions-ku) ---
router.get("/all/all", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 3. SEARCH USERS ---
router.get("/search/:query", async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: req.params.query, $options: "i" } },
                { fullName: { $regex: req.params.query, $options: "i" } },
                { email: { $regex: req.params.query, $options: "i" } }
            ]
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 4. GET SUGGESTED USERS (Not following and not self) ---
router.get("/suggested/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const users = await User.find({
            _id: { $ne: req.params.userId },
            _id: { $nin: currentUser.following }
        }).limit(5);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- PARAMETERIZED ROUTES (must come last) ---

// --- 5. UPDATE USER ---
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

// --- 6. DELETE USER ---
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

// --- 7. GET A USER (Profile details paaka) ---
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("User not found!");
        
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 8. FOLLOW A USER ---
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You already follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

// --- 9. UNFOLLOW A USER ---
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You don't follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot unfollow yourself");
    }
});

module.exports = router;