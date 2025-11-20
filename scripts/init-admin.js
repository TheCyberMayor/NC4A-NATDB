// Initialize Default Admin User
// Run this script once to create the default admin account
// Usage: node scripts/init-admin.js

require('dotenv').config();
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

async function initAdmin() {
    try {
        console.log('🔍 Checking for existing admin users...');
        
        const adminsRef = db.collection('admins');
        const snapshot = await adminsRef.limit(1).get();
        
        if (!snapshot.empty) {
            console.log('❌ Admin user already exists. No action needed.');
            process.exit(0);
        }

        console.log('✅ No admin found. Creating default admin...');

        // Create default admin
        const defaultUsername = 'admin';
        const defaultPassword = 'Admin@123'; // Strong default password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const adminData = {
            username: defaultUsername,
            password: hashedPassword,
            fullName: 'System Administrator',
            role: 'superadmin',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null
        };

        const docRef = await adminsRef.add(adminData);

        console.log('\n✅ Default admin created successfully!');
        console.log('═══════════════════════════════════════');
        console.log('📝 Login Credentials:');
        console.log('   Username:', defaultUsername);
        console.log('   Password:', defaultPassword);
        console.log('═══════════════════════════════════════');
        console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
        console.log('🔑 Admin ID:', docRef.id);
        console.log('\n✨ You can now login at: /login.html');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

initAdmin();
