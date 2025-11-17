const express = require('express');
const router = express.Router();
const {
    login,
    createAdmin,
    getProfile,
    getAllAdmins
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getProfile);
router.post('/create', protect, authorize('superadmin'), createAdmin);
router.get('/all', protect, authorize('superadmin'), getAllAdmins);

module.exports = router;
