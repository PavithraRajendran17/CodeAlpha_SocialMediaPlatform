const router = require("express").Router();
const User = require("../models/User");

// Try to require bcryptjs, fallback to simple comparison if not available
let bcrypt;
let jwt;
try {
    bcrypt = require("bcryptjs");
    jwt = require("jsonwebtoken");
} catch (err) {
    console.log("Security packages not installed, using fallback (for development only)");
}

// REGISTER - Account create panna with password hashing
router.post("/register", async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email: req.body.email }, { username: req.body.username }] 
        });
        
        if (existingUser) {
            if (existingUser.email === req.body.email) {
                return res.status(400).json("Email already registered!");
            }
            if (existingUser.username === req.body.username) {
                return res.status(400).json("Username already taken!");
            }
        }

        // Hash password if bcrypt is available, otherwise store plain text (dev only)
        let password = req.body.password;
        if (bcrypt) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(req.body.password, salt);
        }

        const newUser = new User({
            username: req.body.username,
            fullName: req.body.fullName || req.body.username,
            email: req.body.email,
            password: password,
        });

        const user = await newUser.save();
        
        // Create token if jwt is available
        let token = "dev_token_" + user._id;
        if (jwt) {
            token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "tonogram_secret_key");
        }
        
        // Return user without password
        const { password: pwd, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// LOGIN - Existing user login panna with password verification
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        // 1. User check with return
        if (!user) {
            return res.status(404).json("User not found!");
        }

        // 2. Password check with bcrypt or simple comparison
        let validPassword = false;
        if (bcrypt) {
            validPassword = await bcrypt.compare(req.body.password, user.password);
        } else {
            validPassword = req.body.password === user.password;
        }
        
        if (!validPassword) {
            return res.status(400).json("Wrong password!");
        }

        // 3. Create token
        let token = "dev_token_" + user._id;
        if (jwt) {
            token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "tonogram_secret_key");
        }

        // 4. Success response without password
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

module.exports = router;