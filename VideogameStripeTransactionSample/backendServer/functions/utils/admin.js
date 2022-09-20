const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
} else {
  admin.app();
}

const db = admin.firestore();

module.exports = { admin, db };
