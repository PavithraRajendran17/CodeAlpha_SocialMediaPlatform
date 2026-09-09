const express = require('express'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 1. Routes Import
const authRoute = require("./routes/auth"); 
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const notificationRoute = require("./routes/notifications");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Use fallback values if environment variables are not set
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/CodeAlphaSocial';
const JWT_SECRET = process.env.JWT_SECRET || 'tonogram_development_secret_key';
const PORT = process.env.PORT || 5000;

// Make JWT_SECRET available globally for routes
process.env.JWT_SECRET = JWT_SECRET;

// Debug environment variables
console.log('Environment configuration:', {
    MONGO_URI: MONGO_URI ? 'Set' : 'Using fallback',
    JWT_SECRET: JWT_SECRET ? 'Set' : 'Using fallback',
    PORT: PORT
});

// 2. Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ Database Error: ", err));

// 3. CORS Configuration - Allow frontend to communicate with backend
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
}));

// 4. Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Serve static files from uploads
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// 6. Root Route
app.get('/', (req, res) => {
    res.json({ 
        message: "Tonogram API Server is Running!", 
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// 7. API Routes
app.use("/api/auth", authRoute);   
app.use("/api/users", userRoute);  
app.use("/api/posts", postRoute);  
app.use("/api/notifications", notificationRoute);

// 8. Server Start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});