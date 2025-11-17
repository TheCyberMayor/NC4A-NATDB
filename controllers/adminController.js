const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if admin exists
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        admin.lastLogin = Date.now();
        await admin.save();

        // Create token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Create admin (superadmin only)
// @route   POST /api/admin/create
// @access  Private (Superadmin)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password,
            role: role || 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin',
            error: error.message
        });
    }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);

        res.status(200).json({
            success: true,
            data: admin
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Get all admins (superadmin only)
// @route   GET /api/admin/all
// @access  Private (Superadmin)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');

        res.status(200).json({
            success: true,
            data: admins
        });

    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admins',
            error: error.message
        });
    }
};
