import * as admin from 'firebase-admin';

const serviceAccount = {
  projectId: process.env['FIREBASE_PROJECT_ID'],
  privateKey: (process.env['FIREBASE_PRIVATE_KEY'] || '').replace(/\\n/g, '\n'),
  clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
};

console.log('Firebase Service Account:', {
  projectId: serviceAccount.projectId,
  clientEmail: serviceAccount.clientEmail,
  privateKeySet: serviceAccount.privateKey,
});

if (
  !serviceAccount.projectId ||
  !serviceAccount.privateKey ||
  !serviceAccount.clientEmail
) {
  throw new Error(
    'Firebase service account credentials are missing in environment variables'
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;