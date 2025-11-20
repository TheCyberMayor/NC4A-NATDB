const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, createDefaultAdmin } = require('../controllers/authController');

// Validation rules for login
const loginValidation = [
    body('username').notEmpty().trim().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/login', loginValidation, login);

// Initialize default admin (for first-time setup)
router.post('/init-admin', createDefaultAdmin);

module.exports = router;
