const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from token
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            if (!req.admin.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated'
                });
            }

            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.admin.role} is not authorized to access this route`
            });
        }
        next();
    };
};
