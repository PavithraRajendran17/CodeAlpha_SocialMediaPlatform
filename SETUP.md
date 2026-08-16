# Tonogram - Localhost Setup Guide

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Python** (for frontend server) - Usually pre-installed, or [Download here](https://www.python.org/)

### 📋 Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/PavithraRajendran17/CodeAlpha_SocialMediaPlatform.git
cd CodeAlpha_SocialMediaPlatform
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# The .env file should contain:
MONGO_URI=mongodb://localhost:27017/CodeAlphaSocial
JWT_SECRET=tonogram_development_secret_key_change_in_production
PORT=5000
```

#### 4. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or simply run
mongod
```

#### 5. Start the Backend Server
```bash
# From the backend directory
node server.js
```

**Expected Output:**
```
Security packages not installed, using fallback (for development only)
🚀 Server is running on http://localhost:5000
📡 API available at http://localhost:5000/api
✅ MongoDB Connected Successfully!
```

#### 6. Start the Frontend Server
```bash
# Open a new terminal, navigate to frontend directory
cd frontend

# Start the Python HTTP server
python -m http.server 3000
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Root**: http://localhost:5000/api

### ✅ Verification Checklist

After starting both servers, verify the following:

1. **Backend Health Check**
   ```bash
   # Test backend is running
   curl http://localhost:5000
   # Should return: {"message":"Tonogram API Server is Running!","status":"healthy",...}
   ```

2. **Frontend Access**
   - Open http://localhost:3000 in your browser
   - You should see the Tonogram login/signup page

3. **Database Connection**
   - Check backend terminal for "✅ MongoDB Connected Successfully!"
   - If you see connection errors, ensure MongoDB is running

4. **API Communication**
   - Open browser DevTools (F12) on frontend
   - Check Console tab for "Tonogram Configuration" log
   - Should show: `{ environment: 'development', API_URL: 'http://localhost:5000/api' }`

### 🔧 Troubleshooting

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod

# If not running, start it:
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### Port Already in Use
```bash
# Check what's using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <process_id> /F

# Use a different port by editing backend/.env
PORT=5001
```

#### Frontend Not Loading
- Ensure both terminals are running
- Check that frontend server is on port 3000
- Verify backend is on port 5000
- Clear browser cache and reload

#### CORS Errors
- Check backend/server.js CORS configuration
- Ensure frontend URL is in the allowed origins
- Verify both servers are running on correct ports

### 📝 Testing the Application

1. **Signup Flow**
   - Navigate to http://localhost:3000
   - Click "Sign Up"
   - Fill in: Full Name, Username, Email, Password, Confirm Password
   - Click "Sign Up"
   - Should redirect to main feed

2. **Create Post**
   - Write something in the post input
   - Click "Post"
   - Should see the post appear in the feed

3. **Test Features**
   - Like/unlike posts
   - Add comments
   - Edit profile
   - Search for users
   - Follow/unfollow users
   - Save posts
   - Check notifications
   - Toggle dark/light mode

### 🛑 Stopping the Servers

```bash
# Press Ctrl+C in both terminal windows to stop the servers
# Or close the terminal windows
```

### 📱 Alternative Frontend Server Options

If Python HTTP server doesn't work, try these alternatives:

#### Using Node.js http-server
```bash
cd frontend
npx http-server -p 3000
```

#### Using PHP
```bash
cd frontend
php -S localhost:3000
```

#### Using Live Server (VS Code Extension)
1. Install "Live Server" extension in VS Code
2. Right-click on index.html
3. Select "Open with Live Server"

### 🔒 Security Notes for Development

- The current setup uses fallback authentication (no bcrypt) for development
- For production, install security packages:
  ```bash
  cd backend
  npm install bcryptjs jsonwebtoken
  ```
- Change JWT_SECRET in .env for production
- Use MongoDB Atlas instead of local MongoDB for production

### 🚀 Production Deployment

When ready to deploy:

1. **Backend**: Deploy to Heroku, Render, or Railway
2. **Frontend**: Deploy to GitHub Pages, Netlify, or Vercel
3. **Database**: Use MongoDB Atlas or similar cloud database
4. **Environment**: Update frontend/config.js with production API URL
5. **Security**: Install all security packages and use strong secrets

### 📞 Support

If you encounter issues:
1. Check the terminal outputs for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check that ports 3000 and 5000 are available
5. Review the troubleshooting section above

---

**Note**: This setup is optimized for local development. For production deployment, additional security and configuration steps are required.