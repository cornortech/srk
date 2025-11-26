// Firebase Client SDK - For Frontend Apps (University, Bank)
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// This will be used by frontend apps (university, bank)
// They should pass their env config when initializing
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * Initialize Firebase Client SDK for frontend apps
 * Each app (university, bank) should call this with their own config
 * @param config - Firebase configuration from app's env
 */
export const initializeFirebaseClient = (config: FirebaseClientConfig) => {
  // Check if Firebase is already initialized
  const existingApps = getApps();
  
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    // Validate config before initializing
    if (!config.apiKey || !config.projectId) {
      throw new Error('Firebase API Key and Project ID are required');
    }
    
    app = initializeApp(config);
  }

  // Initialize services only once
  if (!auth) auth = getAuth(app);
  if (!db) db = getFirestore(app);
  if (!storage) storage = getStorage(app);

  return { app, auth, db, storage };
};

/**
 * Get Firebase Auth instance
 * Must call initializeFirebaseClient first
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebaseClient first.');
  }
  return auth;
};

/**
 * Get Firestore instance
 * Must call initializeFirebaseClient first
 */
export const getFirebaseDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebaseClient first.');
  }
  return db;
};

/**
 * Get Firebase Storage instance
 * Must call initializeFirebaseClient first
 */
export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebaseClient first.');
  }
  return storage;
};

// Export instances (will be undefined until initialized)
export { app, auth, db, storage };
