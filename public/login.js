// Login Page JavaScript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://nc4a-natdb.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');

    // Password toggle
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        // Show loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        hideError();

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store auth token
                const expiryDays = rememberMe ? 7 : 1;
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + expiryDays);
                
                const authData = {
                    token: data.token,
                    user: data.user,
                    expiry: expiryDate.getTime()
                };

                localStorage.setItem('cadetn_auth', JSON.stringify(authData));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Connection error. Please check your internet connection and try again.');
        } finally {
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }
});

// Check if user is authenticated
function isAuthenticated() {
    const authData = localStorage.getItem('cadetn_auth');
    
    if (!authData) {
        return false;
    }

    try {
        const parsed = JSON.parse(authData);
        const now = new Date().getTime();
        
        // Check if token has expired
        if (now > parsed.expiry) {
            localStorage.removeItem('cadetn_auth');
            return false;
        }

        return true;
    } catch (error) {
        localStorage.removeItem('cadetn_auth');
        return false;
    }
}
