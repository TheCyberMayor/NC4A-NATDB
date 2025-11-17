const admin = require('firebase-admin');

// Initialize Firebase Admin SDK and export Firestore DB
let db;

try {
    if (process.env.NODE_ENV === 'production') {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        if (!serviceAccountBase64) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable not set.');
        }
        const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('ascii');
        const serviceAccount = JSON.parse(serviceAccountJson);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized for production.');
    } else {
        const serviceAccount = require('../firebase-service-account.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized for development.');
    }

    db = admin.firestore();
} catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
}

module.exports = { db, admin };
