// Auth Guard for Dashboard
(function() {
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

    // Check authentication before page loads
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
})();

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('cadetn_auth');
        window.location.href = 'login.html';
    }
}

// Get auth token for API requests
function getAuthToken() {
    const authData = localStorage.getItem('cadetn_auth');
    if (authData) {
        try {
            return JSON.parse(authData).token;
        } catch (error) {
            return null;
        }
    }
    return null;
}

// Get current user info
function getCurrentUser() {
    const authData = localStorage.getItem('cadetn_auth');
    if (authData) {
        try {
            return JSON.parse(authData).user;
        } catch (error) {
            return null;
        }
    }
    return null;
}
