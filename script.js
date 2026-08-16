const API_URL = window.API_CONFIG ? window.API_CONFIG.API_URL : "http://localhost:5000/api";
let loggedInUser = null;
let currentPostId = null;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').textContent = '☀️';
    }
    checkAuth();
});

// --- THEME TOGGLE ---
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    document.getElementById('themeIcon').textContent = isDarkMode ? '☀️' : '🌙';
}

// --- CHECK AUTH ---
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        loggedInUser = JSON.parse(user);
        enterApp(loggedInUser);
    }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// --- AUTHENTICATION ---
async function handleRegister() {
    const fullName = document.getElementById("regFullName").value;
    const username = document.getElementById("regUser").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;
    const confirmPassword = document.getElementById("regConfirmPass").value;

    if (!fullName || !username || !email || !password) {
        return showToast("Please fill all fields!");
    }
    if (password !== confirmPassword) {
        return showToast("Passwords do not match!");
    }
    if (password.length < 6) {
        return showToast("Password must be at least 6 characters!");
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            enterApp(data);
            showToast("Account created successfully! 🎉");
        } else {
            showToast(data.message || "Signup failed!");
        }
    } catch (err) {
        showToast("Server error!");
    }
}

async function handleLogin() {
    const email = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    if (!email || !password) {
        return showToast("Please fill all fields!");
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            enterApp(data);
            showToast("Welcome back! 👋");
        } else {
            showToast(data.message || "Invalid credentials");
        }
    } catch (err) {
        showToast("Server error!");
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    loggedInUser = null;
    document.getElementById("authWrapper").classList.remove("hidden");
    document.getElementById("homePage").classList.add("hidden");
    showToast("Logged out successfully");
}

function enterApp(user) {
    loggedInUser = user;
    document.getElementById("authWrapper").classList.add("hidden");
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("welcomeUser").innerText = user.username;
    document.getElementById("currentUserProfilePic").src = user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    document.getElementById("sidebarProfilePic").src = user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    showSection('feedSection');
    loadSuggestedUsers();
}

// --- NAVIGATION ---
function showSection(sectionId) {
    const sections = ["feedSection", "profileSection", "searchSection", "savedSection", "notificationsSection"];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.remove("hidden");

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    if (sectionId === 'feedSection') {
        document.getElementById('nav-feed')?.classList.add('active');
        fetchAllPosts();
    } else if (sectionId === 'profileSection') {
        document.getElementById('nav-profile')?.classList.add('active');
        openProfile();
    } else if (sectionId === 'searchSection') {
        document.getElementById('nav-search')?.classList.add('active');
    } else if (sectionId === 'savedSection') {
        document.getElementById('nav-saved')?.classList.add('active');
        fetchSavedPosts();
    } else if (sectionId === 'notificationsSection') {
        document.getElementById('nav-notifications')?.classList.add('active');
        fetchNotifications();
    }
}

// --- IMAGE UPLOAD ---
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function removeImage() {
    document.getElementById('postImage').value = '';
    document.getElementById('previewImg').src = '';
    document.getElementById('imagePreview').classList.add('hidden');
}

async function uploadImage(file) {
    // For now, convert image to base64 for storage
    // In production, this should be replaced with proper file upload
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// --- POST LOGIC ---
async function createNewPost() {
    const desc = document.getElementById("postContent").value;
    const imageInput = document.getElementById("postImage");
    
    if (!desc && !imageInput.files[0]) {
        return showToast("Please add some content!");
    }

    let img = null;
    if (imageInput.files[0]) {
        img = await uploadImage(imageInput.files[0]);
    }

    try {
        const res = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userId: loggedInUser._id, 
                username: loggedInUser.username,
                desc: desc, 
                img: img 
            })
        });
        
        if (res.ok) {
            document.getElementById("postContent").value = "";
            removeImage();
            showToast("Post created successfully! 🎉");
            fetchAllPosts();
        } else {
            showToast("Failed to create post");
        }
    } catch (err) {
        showToast("Server error!");
    }
}

async function fetchAllPosts() {
    try {
        document.getElementById('feedLoading').classList.remove('hidden');
        document.getElementById('allPosts').innerHTML = '';
        
        const res = await fetch(`${API_URL}/posts/timeline/${loggedInUser._id}`);
        const posts = await res.json();
        
        document.getElementById('feedLoading').classList.add('hidden');
        
        if (posts.length === 0) {
            document.getElementById('feedEmpty').classList.remove('hidden');
            return;
        }
        
        document.getElementById('feedEmpty').classList.add('hidden');
        renderPosts(posts, 'allPosts');
    } catch (err) {
        console.error(err);
        document.getElementById('feedLoading').classList.add('hidden');
        showToast("Failed to load posts");
    }
}

function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    posts.forEach(post => {
        const isLiked = post.likes?.includes(loggedInUser._id);
        const isSaved = post.savedBy?.includes(loggedInUser._id);
        const isOwnPost = post.userId === loggedInUser._id;
        
        const postHTML = `
            <div class="post-card">
                <div class="post-header">
                    <img src="${post.userProfilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${post.username}" class="post-user-pic">
                    <div class="post-user-info">
                        <strong>${post.username}</strong>
                        <span class="post-time">${formatTime(post.createdAt)}</span>
                    </div>
                    ${isOwnPost ? `<button class="post-options" onclick="deletePost('${post._id}')">🗑️</button>` : ''}
                </div>
                ${post.img ? `<img src="${post.img}" alt="Post image" class="post-image">` : ''}
                ${post.desc ? `<p class="post-caption">${post.desc}</p>` : ''}
                <div class="post-actions">
                    <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="likePost('${post._id}')">
                        ${isLiked ? '❤️' : '🤍'} ${post.likes?.length || 0}
                    </button>
                    <button class="action-btn" onclick="openCommentsModal('${post._id}')">
                        💬 ${post.comments?.length || 0}
                    </button>
                    <button class="action-btn" onclick="sharePost('${post._id}')">
                        📤 Share
                    </button>
                    <button class="action-btn ${isSaved ? 'saved' : ''}" onclick="savePost('${post._id}')">
                        ${isSaved ? '🔖' : '📑'} Save
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += postHTML;
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
}

async function likePost(postId) {
    try {
        await fetch(`${API_URL}/posts/${postId}/like`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUser._id })
        });
        fetchAllPosts();
    } catch (err) {
        showToast("Failed to like post");
    }
}

async function savePost(postId) {
    try {
        await fetch(`${API_URL}/posts/${postId}/save`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUser._id })
        });
        fetchAllPosts();
        showToast("Post saved!");
    } catch (err) {
        showToast("Failed to save post");
    }
}

async function deletePost(postId) {
    if (!confirm("Delete this post?")) return;
    try {
        await fetch(`${API_URL}/posts/${postId}`, { 
            method: "DELETE", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: loggedInUser._id }) 
        });
        showToast("Post deleted");
        fetchAllPosts();
    } catch (err) {
        showToast("Failed to delete post");
    }
}

function sharePost(postId) {
    showToast("Share link copied to clipboard!");
}

// --- COMMENTS ---
async function openCommentsModal(postId) {
    currentPostId = postId;
    document.getElementById('commentsModal').classList.remove('hidden');
    
    try {
        const res = await fetch(`${API_URL}/posts/${postId}`);
        const post = await res.json();
        renderComments(post.comments || []);
    } catch (err) {
        showToast("Failed to load comments");
    }
}

function closeCommentsModal() {
    document.getElementById('commentsModal').classList.add('hidden');
    currentPostId = null;
}

function renderComments(comments) {
    const container = document.getElementById('commentsList');
    container.innerHTML = '';
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="empty-state">No comments yet.</p>';
        return;
    }
    
    comments.forEach(comment => {
        const isOwnComment = comment.userId === loggedInUser._id;
        container.innerHTML += `
            <div class="comment-item">
                <img src="${comment.userProfilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${comment.username}" class="comment-user-pic">
                <div class="comment-content">
                    <strong>${comment.username}</strong>
                    <p>${comment.text}</p>
                    <span class="comment-time">${formatTime(comment.createdAt)}</span>
                </div>
                ${isOwnComment ? `<button class="delete-comment" onclick="deleteComment('${comment._id}')">🗑️</button>` : ''}
            </div>
        `;
    });
}

async function addComment() {
    const text = document.getElementById('newComment').value;
    if (!text) return;
    
    try {
        await fetch(`${API_URL}/posts/${currentPostId}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userId: loggedInUser._id, 
                username: loggedInUser.username,
                text: text 
            })
        });
        document.getElementById('newComment').value = '';
        openCommentsModal(currentPostId); // Refresh comments
        fetchAllPosts(); // Update comment count
    } catch (err) {
        showToast("Failed to add comment");
    }
}

async function deleteComment(commentId) {
    try {
        await fetch(`${API_URL}/posts/${currentPostId}/comment/delete`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId: commentId })
        });
        openCommentsModal(currentPostId); // Refresh comments
        fetchAllPosts(); // Update comment count
    } catch (err) {
        showToast("Failed to delete comment");
    }
}

// --- PROFILE ---
function openProfile() {
    document.getElementById("profileUsernameSpan").innerText = loggedInUser.username;
    document.getElementById("profileBioSpan").innerText = loggedInUser.bio || "Welcome to my Tonogram profile!";
    document.getElementById("profilePic").src = loggedInUser.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    document.getElementById("coverPic").src = loggedInUser.coverPic || "https://images.unsplash.com/photo-1614850523296-e8c0d9732391?q=80&w=1000&auto=format&fit=crop";
    document.getElementById("followerCount").innerText = loggedInUser.followers?.length || 0;
    document.getElementById("followingCount").innerText = loggedInUser.following?.length || 0;
    fetchUserPostsGrid();
    switchTab('posts');
}

async function fetchUserPostsGrid() {
    try {
        const res = await fetch(`${API_URL}/posts/profile/${loggedInUser.username}`);
        const posts = await res.json();
        const grid = document.getElementById("userPostsGrid");
        document.getElementById("postCount").innerText = posts.length;
        grid.innerHTML = "";
        
        if (posts.length === 0) {
            document.getElementById("emptyGridText").classList.remove('hidden');
            return;
        }
        
        document.getElementById("emptyGridText").classList.add('hidden');
        
        posts.forEach(post => {
            const div = document.createElement("div");
            div.className = "grid-item"; 
            div.innerHTML = `
                ${post.img ? `<img src="${post.img}">` : `<div class="post-text-content">${post.desc}</div>`}
                <div class="post-overlay">
                    <div class="overlay-stats">
                        <span>❤️ ${post.likes ? post.likes.length : 0}</span>
                        <span>💬 ${post.comments ? post.comments.length : 0}</span>
                    </div>
                </div>
            `;
            grid.appendChild(div);
        });
    } catch (err) {
        console.log(err);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active-tab'));
    document.getElementById(`tab-${tabName}`).classList.add('active-tab');
    
    if (tabName === 'saved') {
        fetchSavedPosts();
    } else if (tabName === 'posts') {
        fetchUserPostsGrid();
    } else if (tabName === 'tagged') {
        document.getElementById('userPostsGrid').innerHTML = '<p class="empty-state">Tagged posts feature coming soon!</p>';
    }
}

// --- EDIT PROFILE ---
function openEditProfileModal() {
    document.getElementById('editFullName').value = loggedInUser.fullName || '';
    document.getElementById('editBio').value = loggedInUser.bio || '';
    document.getElementById('editProfileModal').classList.remove('hidden');
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.add('hidden');
}

async function saveProfileChanges() {
    const fullName = document.getElementById('editFullName').value;
    const bio = document.getElementById('editBio').value;
    const profilePicInput = document.getElementById('editProfilePic');
    const coverPicInput = document.getElementById('editCoverPic');
    
    let profilePic = loggedInUser.profilePic;
    let coverPic = loggedInUser.coverPic;
    
    if (profilePicInput.files[0]) {
        profilePic = await uploadImage(profilePicInput.files[0]);
    }
    
    if (coverPicInput.files[0]) {
        coverPic = await uploadImage(coverPicInput.files[0]);
    }
    
    try {
        await fetch(`${API_URL}/users/${loggedInUser._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userId: loggedInUser._id,
                fullName,
                bio,
                profilePic,
                coverPic
            })
        });
        
        // Update local user data
        loggedInUser.fullName = fullName;
        loggedInUser.bio = bio;
        loggedInUser.profilePic = profilePic;
        loggedInUser.coverPic = coverPic;
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        closeEditProfileModal();
        openProfile();
        showToast("Profile updated successfully!");
    } catch (err) {
        showToast("Failed to update profile");
    }
}

// --- SEARCH ---
async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.length < 2) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/users/search/${query}`);
        const users = await res.json();
        renderSearchResults(users);
    } catch (err) {
        console.error(err);
    }
}

function renderSearchResults(users) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';
    
    if (users.length === 0) {
        document.getElementById('searchEmpty').classList.remove('hidden');
        return;
    }
    
    document.getElementById('searchEmpty').classList.add('hidden');
    
    users.forEach(user => {
        const isFollowing = loggedInUser.following?.includes(user._id);
        container.innerHTML += `
            <div class="user-card">
                <img src="${user.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${user.username}" class="user-card-pic">
                <div class="user-card-info">
                    <strong>${user.username}</strong>
                    <p>${user.fullName || ''}</p>
                </div>
                <button class="follow-btn ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${user._id}')">
                    ${isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        `;
    });
}

// --- FOLLOW/UNFOLLOW ---
async function toggleFollow(userId) {
    const isFollowing = loggedInUser.following?.includes(userId);
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    
    try {
        await fetch(`${API_URL}/users/${userId}/${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUser._id })
        });
        
        // Update local following list
        if (isFollowing) {
            loggedInUser.following = loggedInUser.following.filter(id => id !== userId);
        } else {
            loggedInUser.following.push(userId);
        }
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        
        handleSearch(); // Refresh search results
        showToast(isFollowing ? 'Unfollowed' : 'Following!');
    } catch (err) {
        showToast("Failed to follow/unfollow");
    }
}

// --- SUGGESTED USERS ---
async function loadSuggestedUsers() {
    try {
        const res = await fetch(`${API_URL}/users/suggested/${loggedInUser._id}`);
        const users = await res.json();
        renderSuggestedUsers(users);
    } catch (err) {
        console.error(err);
    }
}

function renderSuggestedUsers(users) {
    const container = document.getElementById('userSuggestions');
    container.innerHTML = '';
    
    users.forEach(user => {
        container.innerHTML += `
            <div class="suggested-user">
                <img src="${user.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${user.username}" class="suggested-pic">
                <div class="suggested-info">
                    <strong>${user.username}</strong>
                    <button class="suggested-follow" onclick="toggleFollow('${user._id}')">Follow</button>
                </div>
            </div>
        `;
    });
}

// --- SAVED POSTS ---
async function fetchSavedPosts() {
    try {
        const res = await fetch(`${API_URL}/posts/saved/${loggedInUser._id}`);
        const posts = await res.json();
        
        if (posts.length === 0) {
            document.getElementById('savedEmpty').classList.remove('hidden');
            document.getElementById('savedPostsGrid').innerHTML = '';
            return;
        }
        
        document.getElementById('savedEmpty').classList.add('hidden');
        renderPosts(posts, 'savedPostsGrid');
    } catch (err) {
        showToast("Failed to load saved posts");
    }
}

// --- NOTIFICATIONS ---
async function fetchNotifications() {
    try {
        const res = await fetch(`${API_URL}/notifications/${loggedInUser._id}`);
        const notifications = await res.json();
        
        if (notifications.length === 0) {
            document.getElementById('notificationsEmpty').classList.remove('hidden');
            document.getElementById('notificationsList').innerHTML = '';
            return;
        }
        
        document.getElementById('notificationsEmpty').classList.add('hidden');
        renderNotifications(notifications);
    } catch (err) {
        showToast("Failed to load notifications");
    }
}

function renderNotifications(notifications) {
    const container = document.getElementById('notificationsList');
    container.innerHTML = '';
    
    notifications.forEach(notification => {
        const message = getNotificationMessage(notification);
        container.innerHTML += `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <img src="${notification.fromProfilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${notification.fromUsername}" class="notification-pic">
                <div class="notification-content">
                    <p>${message}</p>
                    <span class="notification-time">${formatTime(notification.createdAt)}</span>
                </div>
                ${!notification.read ? `<button class="mark-read" onclick="markAsRead('${notification._id}')">✓</button>` : ''}
            </div>
        `;
    });
}

function getNotificationMessage(notification) {
    switch(notification.type) {
        case 'like':
            return `<strong>${notification.fromUsername}</strong> liked your post`;
        case 'comment':
            return `<strong>${notification.fromUsername}</strong> commented on your post`;
        case 'follow':
            return `<strong>${notification.fromUsername}</strong> started following you`;
        default:
            return 'New notification';
    }
}

async function markAsRead(notificationId) {
    try {
        await fetch(`${API_URL}/notifications/${notificationId}/read`, { method: "PUT" });
        fetchNotifications();
    } catch (err) {
        showToast("Failed to mark as read");
    }
}

async function markAllAsRead() {
    try {
        await fetch(`${API_URL}/notifications/readall/${loggedInUser._id}`, { method: "PUT" });
        fetchNotifications();
        showToast("All notifications marked as read");
    } catch (err) {
        showToast("Failed to mark all as read");
    }
}