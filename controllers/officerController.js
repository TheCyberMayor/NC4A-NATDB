const { db } = require('../server');
const { validationResult } = require('express-validator');

// Define the valid ranks (same as before)
const VALID_RANKS = [
    'Air Commodore',
    'Group Captain',
    'Wing Commander',
    'Squadron Leader',
    'Flight Lieutenant',
    'Flying Officer',
    'Pilot Officer',
    'Warrant Officer',
    'Flight Sergeant',
    'Sergeant',
    'Corporal',
    'Lance Corporal',
    'Aircraftman/Aircraftwoman'
];

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

        const officersRef = db.collection('officers');

        // Check if officer already exists by officer number
        const officerNumberSnapshot = await officersRef
            .where('officerNumber', '==', req.body.officerNumber)
            .limit(1)
            .get();

        if (!officerNumberSnapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'An entry with this service number already exists'
            });
        }

        // Check if officer already exists by email
        const emailSnapshot = await officersRef
            .where('emailAddress', '==', req.body.emailAddress)
            .limit(1)
            .get();

        if (!emailSnapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'An entry with this email already exists'
            });
        }

        // Create new officer document
        const officerData = {
            ...req.body,
            status: 'pending',
            submissionTimestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await officersRef.add(officerData);
        
        // Get the created document
        const createdDoc = await docRef.get();
        const officer = { id: createdDoc.id, ...createdDoc.data() };

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

        let query = db.collection('officers');

        // Apply filters
        if (status) {
            query = query.where('status', '==', status);
        }
        if (command) {
            query = query.where('command', '==', command);
        }
        if (rank) {
            query = query.where('rank', '==', rank);
        }

        // Note: Firestore doesn't support regex searches like MongoDB
        // For search functionality, you would need to implement it differently
        // (e.g., using Algolia, or searching by exact field matches)

        // Get total count for pagination
        const countSnapshot = await query.get();
        const count = countSnapshot.size;

        // Apply pagination and sorting
        const snapshot = await query
            .orderBy('submissionTimestamp', 'desc')
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit))
            .get();

        const officers = [];
        snapshot.forEach(doc => {
            officers.push({ id: doc.id, ...doc.data() });
        });

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
        const docRef = db.collection('officers').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { id: doc.id, ...doc.data() }
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
        const docRef = db.collection('officers').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        const updateData = {
            ...req.body,
            status: 'updated',
            updatedAt: new Date().toISOString()
        };

        await docRef.update(updateData);
        
        // Get updated document
        const updatedDoc = await docRef.get();

        res.status(200).json({
            success: true,
            message: 'Officer data updated successfully',
            data: { id: updatedDoc.id, ...updatedDoc.data() }
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
        const docRef = db.collection('officers').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        await docRef.delete();

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
        const officersRef = db.collection('officers');
        
        // Get all officers (for small datasets this is fine)
        const snapshot = await officersRef.get();
        
        const totalOfficers = snapshot.size;
        let pendingApprovals = 0;
        let approvedOfficers = 0;
        const officersByRank = {};
        const officersByCommand = {};
        const recentSubmissions = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Count by status
            if (data.status === 'pending') pendingApprovals++;
            if (data.status === 'approved') approvedOfficers++;
            
            // Count by rank
            officersByRank[data.rank] = (officersByRank[data.rank] || 0) + 1;
            
            // Count by command
            officersByCommand[data.command] = (officersByCommand[data.command] || 0) + 1;
            
            // Collect for recent submissions
            recentSubmissions.push({
                id: doc.id,
                officerNumber: data.officerNumber,
                fullName: `${data.surname} ${data.firstName}`,
                rank: data.rank,
                command: data.command,
                submissionTimestamp: data.submissionTimestamp
            });
        });

        // Format rank data
        const rankData = Object.entries(officersByRank)
            .map(([rank, count]) => ({ _id: rank, count }))
            .sort((a, b) => b.count - a.count);

        // Format command data
        const commandData = Object.entries(officersByCommand)
            .map(([command, count]) => ({ _id: command, count }))
            .sort((a, b) => b.count - a.count);

        // Sort and limit recent submissions
        const sortedRecent = recentSubmissions
            .sort((a, b) => new Date(b.submissionTimestamp) - new Date(a.submissionTimestamp))
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                totalOfficers,
                pendingApprovals,
                approvedOfficers,
                officersByRank: rankData,
                officersByCommand: commandData,
                recentSubmissions: sortedRecent
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
        const docRef = db.collection('officers').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        await docRef.update({
            status: 'approved',
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await docRef.get();

        res.status(200).json({
            success: true,
            message: 'Officer approved successfully',
            data: { id: updatedDoc.id, ...updatedDoc.data() }
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

// @desc    Get valid ranks
// @route   GET /api/officers/ranks
// @access  Public
exports.getRanks = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: VALID_RANKS
        });
    } catch (error) {
        console.error('Error fetching ranks:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ranks',
            error: error.message
        });
    }
};
