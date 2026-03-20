const API_URL = "http://localhost:5000/api";
let loggedInUser = null;

// --- 1. AUTHENTICATION ---
async function handleRegister() {
    const username = document.getElementById("regUser").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;
    if (!username || !email || !password) return alert("Fill all details!");
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) enterApp(data); 
        else alert("Signup failed!");
    } catch (err) { alert("Server error!"); }
}

async function handleLogin() {
    const email = document.getElementById("loginUser").value; 
    const password = document.getElementById("loginPass").value;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) 
        });
        const data = await res.json();
        if (res.ok) enterApp(data); 
        else alert("Invalid credentials");
    } catch (err) { alert("Server error!"); }
}

function enterApp(user) {
    loggedInUser = user;
    document.getElementById("authWrapper").classList.add("hidden");
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("welcomeUser").innerText = user.username;
    showSection('feedSection'); 
    loadSuggestedUsers();
}

// --- 2. NAVIGATION ---
function showSection(sectionId) {
    const sections = ["feedSection", "profileSection", "searchSection", "reelsSection"];
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
    }
}

// --- 3. POST LOGIC ---
async function createNewPost() {
    const desc = document.getElementById("postContent").value;
    if (!desc) return;
    try {
        const res = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUser._id, desc: desc, username: loggedInUser.username })
        });
        if (res.ok) {
            document.getElementById("postContent").value = "";
            alert("Post shared! 🎉");
            fetchAllPosts();
            if(!document.getElementById("profileSection").classList.contains("hidden")) fetchUserPostsGrid();
        }
    } catch (err) { console.error(err); }
}

async function fetchUserPostsGrid() {
    try {
        const res = await fetch(`${API_URL}/posts/profile/${loggedInUser.username}`);
        const posts = await res.json();
        const grid = document.getElementById("userPostsGrid");
        document.getElementById("postCount").innerText = posts.length;
        grid.innerHTML = "";
        
        posts.forEach(post => {
            const div = document.createElement("div");
            div.className = "grid-item"; 
            div.innerHTML = `
                ${post.img ? `<img src="${post.img}">` : `<div class="post-text-content">${post.desc}</div>`}
                <div class="post-overlay">
                    <div class="overlay-top">
                        <div class="three-dots" onclick="event.stopPropagation(); toggleMenu('${post._id}')">⋮
                            <div id="menu-${post._id}" class="dropdown-menu hidden">
                                <button onclick="editPost('${post._id}', '${post.desc}')">✏️ Edit</button>
                                <button onclick="deletePost('${post._id}')" style="color:#ff4d4d;">🗑️ Delete</button>
                            </div>
                        </div>
                    </div>
                    <div class="overlay-stats">
                        <span onclick="likePost('${post._id}')">❤️ ${post.likes ? post.likes.length : 0}</span>
                        <span onclick="openComments('${post._id}')">💬 ${post.comments ? post.comments.length : 0}</span>
                    </div>
                </div>
            `;
            grid.appendChild(div);
        });
    } catch (err) { console.log(err); }
}

function toggleMenu(postId) {
    document.querySelectorAll('.dropdown-menu').forEach(m => {
        if(m.id !== `menu-${postId}`) m.classList.add('hidden');
    });
    const menu = document.getElementById(`menu-${postId}`);
    menu.classList.toggle("hidden");
}

async function deletePost(postId) {
    if (!confirm("Delete this post?")) return;
    await fetch(`${API_URL}/posts/${postId}`, { 
        method: "DELETE", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ userId: loggedInUser._id }) 
    });
    fetchUserPostsGrid();
}

async function editPost(postId, oldDesc) {
    const newDesc = prompt("Edit post:", oldDesc);
    if (!newDesc || newDesc === oldDesc) return;
    await fetch(`${API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUser._id, desc: newDesc })
    });
    fetchUserPostsGrid();
}

async function likePost(postId) {
    await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUser._id })
    });
    fetchUserPostsGrid();
}

async function openComments(postId) {
    const text = prompt("Add a comment:");
    if(!text) return;
    await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUser._id, text, username: loggedInUser.username })
    });
    fetchUserPostsGrid();
}

function openProfile() {
    document.getElementById("profileUsernameSpan").innerText = loggedInUser.username;
    fetchUserPostsGrid();
    switchTab('posts');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active-tab'));
    document.getElementById(`tab-${tabName}`).classList.add('active-tab');
}