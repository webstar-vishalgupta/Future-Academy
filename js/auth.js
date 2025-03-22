/**
 * Authentication JavaScript
 * Handles user login, registration, and authentication state
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication
    initAuth();
    
    // Setup login/register form listeners if they exist
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Setup logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

/**
 * Initialize authentication state
 * Checks for existing token and updates UI accordingly
 */
function initAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            updateAuthUI(true, user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            clearAuthData();
            updateAuthUI(false);
        }
    } else {
        updateAuthUI(false);
    }
}

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    try {
        // Hide any previous error
        errorElement.style.display = 'none';
        
        // Make API request to login
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            // Redirect to home page or previous page
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
            window.location.href = redirectTo;
        } else {
            // Show error message
            errorElement.textContent = data.message || 'Login failed. Please check your credentials.';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorElement.textContent = 'An error occurred during login. Please try again.';
        errorElement.style.display = 'block';
    }
}

/**
 * Handle registration form submission
 * @param {Event} e - Submit event
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('register-error');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.style.display = 'block';
        return;
    }
    
    try {
        // Hide any previous error
        errorElement.style.display = 'none';
        
        // Make API request to register
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            // Show error message
            errorElement.textContent = data.message || 'Registration failed. Please try again.';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorElement.textContent = 'An error occurred during registration. Please try again.';
        errorElement.style.display = 'block';
    }
}

/**
 * Handle user logout
 */
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        // Make API request to logout
        const token = localStorage.getItem('token');
        
        if (token) {
            await fetch('/api/auth/logout', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear auth data regardless of API response
        clearAuthData();
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

/**
 * Update UI based on authentication state
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {object} user - User data if authenticated
 */
function updateAuthUI(isAuthenticated, user = null) {
    // Get navigation area for authentication buttons
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    
    if (isAuthenticated && user) {
        // User is logged in
        // Find or create required elements
        let userProfileDiv = navActions.querySelector('.user-profile');
        let loginBtn = navActions.querySelector('.login-btn');
        let logoutBtn = navActions.querySelector('#logout-btn');
        
        // Remove login button if it exists
        if (loginBtn) {
            loginBtn.remove();
        }
        
        // Create user profile if it doesn't exist
        if (!userProfileDiv) {
            userProfileDiv = document.createElement('div');
            userProfileDiv.className = 'user-profile';
            
            // Create profile picture
            const profileImg = document.createElement('img');
            profileImg.alt = 'User Profile';
            userProfileDiv.appendChild(profileImg);
            
            // Create user name span
            const nameSpan = document.createElement('span');
            userProfileDiv.appendChild(nameSpan);
            
            // Create logout button if it doesn't exist
            if (!logoutBtn) {
                logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.className = 'logout-btn';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
                logoutBtn.title = 'Logout';
                logoutBtn.addEventListener('click', handleLogout);
            }
            
            // Insert both elements into nav actions
            navActions.insertBefore(userProfileDiv, navActions.firstChild);
            navActions.appendChild(logoutBtn);
        }
        
        // Update profile information
        const profileImg = userProfileDiv.querySelector('img');
        const nameSpan = userProfileDiv.querySelector('span');
        
        profileImg.src = user.profilePicture || 'images/avatar.jpg';
        nameSpan.textContent = user.name;
        
        // Ensure the logout button exists and has event listener
        if (!logoutBtn) {
            logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.title = 'Logout';
            logoutBtn.addEventListener('click', handleLogout);
            navActions.appendChild(logoutBtn);
        }
    } else {
        // User is not logged in
        // Find or remove user profile elements
        const userProfileDiv = navActions.querySelector('.user-profile');
        const logoutBtn = navActions.querySelector('#logout-btn');
        
        if (userProfileDiv) {
            userProfileDiv.remove();
        }
        
        if (logoutBtn) {
            logoutBtn.remove();
        }
        
        // Add login button if it doesn't exist
        let loginBtn = navActions.querySelector('.login-btn');
        if (!loginBtn) {
            loginBtn = document.createElement('a');
            loginBtn.href = 'login.html';
            loginBtn.className = 'login-btn primary-btn';
            loginBtn.textContent = 'Log In';
            navActions.insertBefore(loginBtn, navActions.firstChild);
        }
    }
}

/**
 * Clear authentication data from local storage
 */
function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI(false);
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

/**
 * Get current user data
 * @returns {object|null} - User data or null if not authenticated
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
}

/**
 * Get authentication token
 * @returns {string|null} - Token or null if not authenticated
 */
function getToken() {
    return localStorage.getItem('token');
}

// Expose authentication functions globally
window.authUtils = {
    isAuthenticated,
    getCurrentUser,
    getToken,
    logout: handleLogout
}; 