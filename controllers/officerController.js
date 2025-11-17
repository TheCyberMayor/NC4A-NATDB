const Officer = require('../models/Officer');
const { validationResult } = require('express-validator');

// @desc    Submit officer data
// @route   POST /api/officers
// @access  Public
exports.createOfficer = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Check if officer already exists
        const existingOfficer = await Officer.findOne({
            $or: [
                { officerNumber: req.body.officerNumber },
                { emailAddress: req.body.emailAddress }
            ]
        });

        if (existingOfficer) {
            return res.status(400).json({
                success: false,
                message: 'An entry with this service number or email already exists'
            });
        }

        // Create new officer
        const officer = await Officer.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Officer data submitted successfully',
            data: officer
        });

    } catch (error) {
        console.error('Error creating officer:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting officer data',
            error: error.message
        });
    }
};

// @desc    Get all officers
// @route   GET /api/officers
// @access  Private (Admin)
exports.getAllOfficers = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, command, rank, search } = req.query;

        // Build query
        const query = {};
        
        if (status) query.status = status;
        if (command) query.command = command;
        if (rank) query.rank = rank;
        if (search) {
            query.$or = [
                { officerNumber: new RegExp(search, 'i') },
                { surname: new RegExp(search, 'i') },
                { firstName: new RegExp(search, 'i') },
                { emailAddress: new RegExp(search, 'i') }
            ];
        }

        // Execute query with pagination
        const officers = await Officer.find(query)
            .sort({ submissionTimestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Officer.countDocuments(query);

        res.status(200).json({
            success: true,
            data: officers,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching officers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching officers',
            error: error.message
        });
    }
};

// @desc    Get single officer
// @route   GET /api/officers/:id
// @access  Private (Admin)
exports.getOfficer = async (req, res) => {
    try {
        const officer = await Officer.findById(req.params.id);

        if (!officer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: officer
        });

    } catch (error) {
        console.error('Error fetching officer:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching officer',
            error: error.message
        });
    }
};

// @desc    Update officer
// @route   PUT /api/officers/:id
// @access  Private (Admin)
exports.updateOfficer = async (req, res) => {
    try {
        const officer = await Officer.findByIdAndUpdate(
            req.params.id,
            { ...req.body, status: 'updated' },
            { new: true, runValidators: true }
        );

        if (!officer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Officer data updated successfully',
            data: officer
        });

    } catch (error) {
        console.error('Error updating officer:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating officer',
            error: error.message
        });
    }
};

// @desc    Delete officer
// @route   DELETE /api/officers/:id
// @access  Private (Admin)
exports.deleteOfficer = async (req, res) => {
    try {
        const officer = await Officer.findByIdAndDelete(req.params.id);

        if (!officer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Officer deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting officer:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting officer',
            error: error.message
        });
    }
};

// @desc    Get statistics
// @route   GET /api/officers/stats
// @access  Private (Admin)
exports.getStatistics = async (req, res) => {
    try {
        const totalOfficers = await Officer.countDocuments();
        const pendingApprovals = await Officer.countDocuments({ status: 'pending' });
        const approvedOfficers = await Officer.countDocuments({ status: 'approved' });
        
        const officersByRank = await Officer.aggregate([
            { $group: { _id: '$rank', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const officersByCommand = await Officer.aggregate([
            { $group: { _id: '$command', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentSubmissions = await Officer.find()
            .sort({ submissionTimestamp: -1 })
            .limit(10)
            .select('officerNumber fullName rank command submissionTimestamp');

        res.status(200).json({
            success: true,
            data: {
                totalOfficers,
                pendingApprovals,
                approvedOfficers,
                officersByRank,
                officersByCommand,
                recentSubmissions
            }
        });

    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// @desc    Approve officer
// @route   PATCH /api/officers/:id/approve
// @access  Private (Admin)
exports.approveOfficer = async (req, res) => {
    try {
        const officer = await Officer.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );

        if (!officer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Officer approved successfully',
            data: officer
        });

    } catch (error) {
        console.error('Error approving officer:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving officer',
            error: error.message
        });
    }
};
