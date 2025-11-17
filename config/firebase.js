const admin = require('firebase-admin');

// Initialize Firebase Admin SDK and export Firestore DB
let db;

try {
    if (process.env.NODE_ENV === 'production') {
        const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

        let serviceAccount;
        if (b64) {
            try {
                const decoded = Buffer.from(b64, 'base64').toString('utf8');
                serviceAccount = JSON.parse(decoded);
            } catch (e) {
                // If user pasted raw JSON into the BASE64 var by mistake, try parsing directly
                try {
                    serviceAccount = JSON.parse(b64);
                } catch (e2) {
                    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_BASE64: not valid base64 or JSON');
                }
            }
        } else if (rawJson) {
            try {
                serviceAccount = JSON.parse(rawJson);
            } catch (e) {
                throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON: not valid JSON');
            }
        } else {
            throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT_JSON');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        const meta = { project_id: serviceAccount.project_id, client_email: serviceAccount.client_email };
        console.log('Firebase Admin SDK initialized for production.', meta);
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
