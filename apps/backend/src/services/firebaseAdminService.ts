import * as admin from 'firebase-admin';

// Firebase config is intentionally read from process.env directly
// (removed from centralized env.ts because Cloudflare R2 is used for uploads)

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;

function initializeFirebaseAdmin() {
  if (!firebaseApp) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      } as admin.ServiceAccount),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    });
  }
  return firebaseApp;
}

/**
 * Upload a file to Firebase Storage
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name of the file in storage
 * @param folder - The folder path in storage
 * @returns The public download URL of the uploaded file
 */
export async function uploadFileToFirebaseStorage(
  fileBuffer: Buffer,
  fileName: string,
  folder = 'agreements'
): Promise<string> {
  try {
    const app = initializeFirebaseAdmin();
    const bucket = admin.storage(app).bucket();
    
    const filePath = `${folder}-test/${fileName}`;
    const file = bucket.file(filePath);
    
    await file.save(fileBuffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });
    
    // Generate a signed URL that expires in 7 days (max allowed by Google Cloud Storage)
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days (max allowed)
    });
    
    console.log(`File uploaded to Firebase Storage: ${filePath}`);
    return signedUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw error;
  }
}

/**
 * Delete a file from Firebase Storage
 * @param filePath - The path of the file to delete
 */
export async function deleteFileFromFirebaseStorage(filePath: string): Promise<void> {
  try {
    const app = initializeFirebaseAdmin();
    const bucket = admin.storage(app).bucket();
    
    await bucket.file(filePath).delete();
    
    console.log(`File deleted from Firebase Storage: ${filePath}`);
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    throw error;
  }
}
