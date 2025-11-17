// Test script to verify server setup
require('dotenv').config();

console.log('\n=== CADETN Server Configuration Check ===\n');

// Check Node version
const nodeVersion = process.version;
console.log(`✓ Node.js Version: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 18) {
    console.log('⚠️  Warning: Node.js version should be 18 or higher');
}

// Check environment variables
console.log('\n--- Environment Variables ---');
console.log(`PORT: ${process.env.PORT || '❌ Not set (default: 5000)'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✓ Set' : '❌ Not set'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Set' : '❌ Not set'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Check required packages
console.log('\n--- Checking Dependencies ---');
try {
    require('express');
    console.log('✓ Express installed');
} catch (e) {
    console.log('❌ Express not installed');
}

try {
    require('mongoose');
    console.log('✓ Mongoose installed');
} catch (e) {
    console.log('❌ Mongoose not installed');
}

try {
    require('jsonwebtoken');
    console.log('✓ JWT installed');
} catch (e) {
    console.log('❌ JWT not installed');
}

try {
    require('bcryptjs');
    console.log('✓ Bcrypt installed');
} catch (e) {
    console.log('❌ Bcrypt not installed');
}

// Check file structure
console.log('\n--- Checking File Structure ---');
const fs = require('fs');

const requiredFiles = [
    'server.js',
    'package.json',
    '.env',
    'models/Officer.js',
    'models/Admin.js',
    'controllers/officerController.js',
    'controllers/adminController.js',
    'routes/officers.js',
    'routes/admin.js',
    'middleware/auth.js',
    'public/index.html',
    'public/styles.css',
    'public/script.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✓ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

console.log('\n--- Summary ---');
if (!process.env.MONGODB_URI) {
    console.log('⚠️  MongoDB URI not configured. Please edit .env file');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change_this')) {
    console.log('⚠️  JWT_SECRET not configured properly. Please edit .env file');
}
if (allFilesExist && process.env.MONGODB_URI && process.env.JWT_SECRET) {
    console.log('\n✅ Configuration looks good! Ready to start server.');
    console.log('\nNext steps:');
    console.log('1. Run: node init-admin.js');
    console.log('2. Run: npm start');
    console.log('3. Open: http://localhost:5000\n');
} else {
    console.log('\n⚠️  Please fix the issues above before starting the server.\n');
}
