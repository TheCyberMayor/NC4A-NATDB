const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createOfficer,
    getAllOfficers,
    getOfficer,
    updateOfficer,
    deleteOfficer,
    getStatistics,
    approveOfficer
} = require('../controllers/officerController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const officerValidation = [
    body('surname').notEmpty().trim().withMessage('Surname is required'),
    body('firstName').notEmpty().trim().withMessage('First name is required'),
    body('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('stateOfOrigin').notEmpty().withMessage('State of origin is required'),
    body('lga').notEmpty().withMessage('LGA is required'),
    body('nationality').notEmpty().withMessage('Nationality is required'),
    body('homeAddress').notEmpty().withMessage('Home address is required'),
    body('officerNumber').notEmpty().trim().withMessage('Officer number is required'),
    body('rank').notEmpty().withMessage('Rank is required'),
    body('dateOfEnlistment').isDate().withMessage('Valid enlistment date is required'),
    body('command').notEmpty().withMessage('Command is required'),
    body('unit').notEmpty().withMessage('Unit is required'),
    body('currentPosting').notEmpty().withMessage('Current posting is required'),
    body('phoneNumber').matches(/^0[789][01]\d{8}$/).withMessage('Valid Nigerian phone number is required'),
    body('emailAddress').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('contactAddress').notEmpty().withMessage('Contact address is required'),
    body('highestQualification').notEmpty().withMessage('Highest qualification is required'),
    body('nokName').notEmpty().withMessage('Next of kin name is required'),
    body('nokRelationship').notEmpty().withMessage('Next of kin relationship is required'),
    body('nokPhone').matches(/^0[789][01]\d{8}$/).withMessage('Valid Nigerian phone number is required for next of kin'),
    body('nokAddress').notEmpty().withMessage('Next of kin address is required'),
    body('maritalStatus').isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Valid marital status is required'),
    body('officerSignature').notEmpty().withMessage('Officer signature is required'),
    body('submissionDate').isDate().withMessage('Valid submission date is required')
];

// Public routes
router.post('/', officerValidation, createOfficer);

// Protected routes (require authentication)
router.get('/', protect, getAllOfficers);
router.get('/stats', protect, getStatistics);
router.get('/:id', protect, getOfficer);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateOfficer);
router.delete('/:id', protect, authorize('superadmin'), deleteOfficer);
router.patch('/:id/approve', protect, authorize('admin', 'superadmin'), approveOfficer);

module.exports = router;
