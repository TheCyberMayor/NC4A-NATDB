require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cadetn.org';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2025';
        
        const adminExists = await Admin.findOne({ email: adminEmail });
        
        if (adminExists) {
            console.log('\n⚠️  Admin already exists!');
            console.log(`Email: ${adminEmail}`);
            console.log('\nIf you forgot your password, delete the admin from database and run this script again.\n');
            process.exit(0);
        }
        
        const admin = await Admin.create({
            name: 'System Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'superadmin',
            isActive: true
        });
        
        console.log('\n✅ Admin created successfully!');
        console.log('\n╔═══════════════════════════════════════╗');
        console.log('║   ADMIN CREDENTIALS                   ║');
        console.log('╠═══════════════════════════════════════╣');
        console.log(`║   Email:    ${adminEmail.padEnd(23)} ║`);
        console.log(`║   Password: ${adminPassword.padEnd(23)} ║`);
        console.log('╚═══════════════════════════════════════╝');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
