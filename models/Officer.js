const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
    // Personal Information
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        trim: true,
        uppercase: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        uppercase: true
    },
    middleName: {
        type: String,
        trim: true,
        uppercase: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female']
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },
    stateOfOrigin: {
        type: String,
        required: [true, 'State of origin is required']
    },
    lga: {
        type: String,
        required: [true, 'LGA is required']
    },
    nationality: {
        type: String,
        required: [true, 'Nationality is required'],
        default: 'Nigerian'
    },
    homeAddress: {
        type: String,
        required: [true, 'Home address is required']
    },

    // Service Records
    officerNumber: {
        type: String,
        required: [true, 'Service number is required'],
        unique: true,
        index: true,
        trim: true,
        uppercase: true
    },
    rank: {
        type: String,
        required: [true, 'Rank is required']
    },
    dateOfEnlistment: {
        type: Date,
        required: [true, 'Date of enlistment is required']
    },
    dateOfLastPromotion: {
        type: Date
    },
    command: {
        type: String,
        required: [true, 'Command is required']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required']
    },
    specialization: {
        type: String
    },
    currentPosting: {
        type: String,
        required: [true, 'Current posting is required']
    },
    dateOfCurrentPosting: {
        type: Date
    },

    // Contact Information
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^0[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number']
    },
    alternatePhone: {
        type: String,
        match: [/^0[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number']
    },
    emailAddress: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        index: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    contactAddress: {
        type: String,
        required: [true, 'Contact address is required']
    },

    // Educational Qualifications
    highestQualification: {
        type: String,
        required: [true, 'Highest qualification is required']
    },
    discipline: {
        type: String
    },
    institution: {
        type: String
    },
    yearOfGraduation: {
        type: Number,
        min: 1960,
        max: new Date().getFullYear()
    },
    professionalCertifications: {
        type: String
    },

    // Next of Kin
    nokName: {
        type: String,
        required: [true, 'Next of kin name is required']
    },
    nokRelationship: {
        type: String,
        required: [true, 'Next of kin relationship is required']
    },
    nokPhone: {
        type: String,
        required: [true, 'Next of kin phone is required'],
        match: [/^0[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number']
    },
    nokAddress: {
        type: String,
        required: [true, 'Next of kin address is required']
    },

    // Additional Information
    maritalStatus: {
        type: String,
        required: [true, 'Marital status is required'],
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    numberOfDependents: {
        type: Number,
        min: 0,
        default: 0
    },
    nin: {
        type: String,
        match: [/^\d{11}$/, 'NIN must be exactly 11 digits']
    },
    specialSkills: {
        type: String
    },
    remarks: {
        type: String
    },

    // Declaration
    officerSignature: {
        type: String,
        required: [true, 'Officer signature is required']
    },
    submissionDate: {
        type: Date,
        required: [true, 'Submission date is required']
    },

    // System Fields
    submissionTimestamp: {
        type: Date,
        default: Date.now
    },
    formVersion: {
        type: String,
        default: '1.0'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'updated'],
        default: 'pending'
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for faster queries (officerNumber and emailAddress already have unique indexes)
officerSchema.index({ command: 1 });
officerSchema.index({ rank: 1 });
officerSchema.index({ status: 1 });
officerSchema.index({ submissionTimestamp: -1 });

// Virtual for full name
officerSchema.virtual('fullName').get(function() {
    return `${this.surname} ${this.firstName} ${this.middleName || ''}`.trim();
});

// Virtual for age
officerSchema.virtual('age').get(function() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual for years of service
officerSchema.virtual('yearsOfService').get(function() {
    const today = new Date();
    const enlistmentDate = new Date(this.dateOfEnlistment);
    const years = today.getFullYear() - enlistmentDate.getFullYear();
    return years;
});

// Ensure virtuals are included in JSON
officerSchema.set('toJSON', { virtuals: true });
officerSchema.set('toObject', { virtuals: true });

// Pre-save middleware
officerSchema.pre('save', function(next) {
    this.lastModified = Date.now();
    next();
});

const Officer = mongoose.model('Officer', officerSchema);

module.exports = Officer;
