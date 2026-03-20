const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

// 1. Routes Import
const authRoute = require("./routes/auth"); 
const userRoute = require("./routes/users"); // Idhu ippo add panniyachu
const postRoute = require("./routes/posts");

dotenv.config();
const app = express();

// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("Database Error: ", err));

// 3. Middleware Setup
app.use(cors()); 
app.use(express.json()); 

// 4. API Routes
app.use("/api/auth", authRoute);   // Login & Register-kaga
app.use("/api/users", userRoute);  // Follow & Profile-kaga (Idhu missing-ah irundhadhu)
app.use("/api/posts", postRoute);  // Posts-kaga

// Basic Home Route for Testing
app.get('/', (req, res) => {
    res.send("CodeAlpha Social Media Server Super-ah Run aagudhu!");
});

// 5. Server Start
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});