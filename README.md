# Tonogram - Social Media Platform

A complete, functional social media web application built with Node.js, Express, MongoDB, and vanilla JavaScript. Tonogram allows users to create posts, share images, follow others, like and comment on posts, and much more.

## 🌐 Live Demo

**GitHub Pages Demo**: https://pavithrarajendran17.github.io/CodeAlpha_SocialMediaPlatform/

### What's Available on GitHub Pages
- ✅ Complete user interface and design
- ✅ All navigation and UI elements
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark/light mode toggle
- ✅ Visual demonstration of all features
- ✅ Professional Tonogram branding

### What Requires Local Setup
- ❌ User authentication (signup/login)
- ❌ Creating posts with data persistence
- ❌ Like/unlike functionality
- ❌ Comment system
- ❌ Follow/unfollow features
- ❌ Real-time data updates

⚠️ **Note**: The GitHub Pages deployment is a **frontend-only demo**. For full functionality including authentication, posts, likes, comments, and data persistence, please run the application locally using the setup instructions below.

## 🏗️ Deployment Architecture

### GitHub Pages (Frontend)
- **Purpose**: UI/UX demonstration and portfolio showcase
- **Branch**: `gh-pages`
- **Contents**: Frontend files only (HTML, CSS, JS, assets)
- **Limitations**: No backend connectivity, no data persistence

### Local Development (Full Stack)
- **Purpose**: Complete application with all features
- **Components**: Frontend + Backend + Database
- **Functionality**: All features including authentication, data persistence
- **Setup**: Follow the Quick Start instructions below

### Production Deployment (Future)
- **Frontend**: GitHub Pages, Netlify, or Vercel
- **Backend**: Heroku, Render, or Railway
- **Database**: MongoDB Atlas
- **Configuration**: Update `frontend/config.js` with production API URL

## 🚀 Quick Start (Localhost - Full Functionality)

## 🚀 Quick Start (Localhost)

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher) 
- **Python** (for frontend server)

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/PavithraRajendran17/CodeAlpha_SocialMediaPlatform.git
cd CodeAlpha_SocialMediaPlatform
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# The .env file should contain (default values work for localhost):
MONGO_URI=mongodb://localhost:27017/CodeAlphaSocial
JWT_SECRET=tonogram_development_secret_key_change_in_production
PORT=5000
```

4. **Start MongoDB**
```bash
# On Windows
net start MongoDB

# On macOS/Linux  
sudo systemctl start mongod
# or just run
mongod
```

5. **Start the application**
```bash
# Terminal 1: Start backend
cd backend
node server.js

# Terminal 2: Start frontend  
cd frontend
python -m http.server 3000
```

6. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

**📖 For detailed setup instructions, see [SETUP.md](SETUP.md)**

## 📋 Features

### ✅ Implemented Features

- **Authentication System**
  - User registration with validation
  - Secure login with password hashing (bcrypt)
  - JWT token-based authentication
  - Persistent login sessions
  - Password visibility toggle

- **User Profiles**
  - Customizable profile pictures and cover photos
  - Bio editing
  - Post count, followers, and following statistics
  - Profile grid view of user posts
  - Saved posts collection
  - Tagged posts section

- **Social Features**
  - Create posts with text and images
  - Image upload with preview
  - Like/unlike posts
  - Comment system with nested functionality
  - Follow/unfollow users
  - Save/bookmark posts
  - User search functionality
  - Suggested users

- **Notifications**
  - Like notifications
  - Comment notifications
  - Follow notifications
  - Read/unread status
  - Mark all as read

- **UI/UX**
  - Modern, responsive design
  - Dark/Light mode toggle
  - Mobile-friendly navigation
  - Toast notifications
  - Modal dialogs
  - Smooth animations and transitions
  - Professional Tonogram branding

- **Technical Features**
  - RESTful API architecture
  - MongoDB database with Mongoose ODM
  - CORS configuration for localhost
  - Environment variable configuration
  - Comprehensive error handling
  - Security best practices

## 🌐 Deployment

### Frontend Deployment (GitHub Pages)

1. Update the `production.API_URL` in `frontend/config.js` with your deployed backend URL
2. Push the frontend files to the `gh-pages` branch or configure GitHub Pages settings

### Backend Deployment (Heroku/Render/Railway)

#### Heroku Deployment
1. Create a new Heroku app
2. Add MongoDB addon (MongoDB Atlas)
3. Set environment variables in Heroku dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secret key
   - `PORT`: Heroku automatically sets this
4. Deploy the backend folder

#### Render Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && node server.js`
5. Add environment variables

## 📁 Project Structure

```
CodeAlpha_SocialMediaPlatform/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Post.js          # Post schema
│   │   └── Notification.js  # Notification schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User routes
│   │   ├── posts.js         # Post routes
│   │   └── notifications.js # Notification routes
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment variables template
│   └── .env                 # Environment variables (create this)
├── frontend/
│   ├── assets/
│   │   └── uploads/         # Static assets
│   ├── index.html           # Main HTML file
│   ├── style.css            # Styling
│   ├── script.js            # Frontend logic
│   ├── config.js            # API configuration
│   └── package.json         # Frontend scripts
├── package.json             # Root package file
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/follow` - Follow user
- `PUT /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/all/all` - Get all users
- `GET /api/users/search/:query` - Search users
- `GET /api/users/suggested/:userId` - Get suggested users

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/timeline/:userId` - Get timeline posts
- `GET /api/posts/profile/:username` - Get user posts
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post
- `PUT /api/posts/:id/comment` - Add comment
- `PUT /api/posts/:id/comment/delete` - Delete comment
- `PUT /api/posts/:id/save` - Save/unsave post
- `GET /api/posts/saved/:userId` - Get saved posts

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/readall/:userId` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### System
- `GET /` - Server status
- `GET /api/health` - Health check endpoint

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper CORS setup for localhost and production
- **Environment Variables**: Sensitive data stored in environment variables
- **No SQL Injection**: Using MongoDB with parameterized queries

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `net start MongoDB` (Windows) or `sudo systemctl start mongod` (Linux/Mac)
- Check your `MONGO_URI` in `backend/.env` file
- Verify MongoDB is accessible on port 27017

### Backend Not Starting
- Check if port 5000 is already in use: `netstat -ano | findstr :5000` (Windows)
- Verify all dependencies are installed: `cd backend && npm install`
- Check Node.js version: `node --version` (should be v14+)

### Frontend Not Loading
- Ensure frontend server is running on port 3000
- Check that backend is running on port 5000
- Verify API configuration in `frontend/config.js`
- Check browser console for errors

### API Connection Issues
- Verify CORS settings in `backend/server.js`
- Check that both frontend and backend are running
- Ensure no firewall is blocking localhost connections
- Check browser network tab for failed requests

### Port Conflicts
- Change backend port in `backend/.env`: `PORT=5001`
- Change frontend port in `frontend/package.json`: modify the start script

## 📱 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a portfolio project for CodeAlpha internship submission. For suggestions or improvements, please create an issue or pull request.

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

**Pavithra Rajendran**
- CodeAlpha Intern
- Portfolio Project

## 🙏 Acknowledgments

- CodeAlpha for the internship opportunity
- Open source community for the tools and libraries used

---

**Note**: This is a complete, functional social media platform suitable for portfolio demonstration and technical interviews. All major features are implemented and working on localhost.