const { db } = require('../config/firebase');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'cadetn-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        // Find user in Firestore
        const usersRef = db.collection('admins');
        const snapshot = await usersRef
            .where('username', '==', username.toLowerCase())
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const userDoc = snapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Update last login
        await usersRef.doc(user.id).update({
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// @desc    Create default admin user (first-time setup only)
// @route   POST /api/auth/init-admin
// @access  Public (but checks if admin already exists)
exports.createDefaultAdmin = async (req, res) => {
    try {
        const adminsRef = db.collection('admins');
        
        // Check if any admin already exists
        const snapshot = await adminsRef.limit(1).get();
        
        if (!snapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'Admin user already exists'
            });
        }

        // Create default admin
        const defaultPassword = 'admin123'; // User should change this immediately
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const adminData = {
            username: 'admin',
            password: hashedPassword,
            fullName: 'System Administrator',
            role: 'superadmin',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null
        };

        const docRef = await adminsRef.add(adminData);

        res.status(201).json({
            success: true,
            message: 'Default admin created successfully',
            credentials: {
                username: 'admin',
                password: defaultPassword,
                note: 'Please change this password immediately after first login'
            },
            adminId: docRef.id
        });

    } catch (error) {
        console.error('Error creating default admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin user',
            error: error.message
        });
    }
};

// @desc    Verify JWT token (middleware)
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
