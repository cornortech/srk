/**
 * Environment variables configuration for University App
 * All variables must be prefixed with VITE_ to be accessible in the browser
 */

export const env = {
  // API Configuration
  backendUrl: (import.meta.env.VITE_BACKEND_ROOT_URL || 'http://localhost:4000').replace(/\/$/, ''),
  frontendUrl: import.meta.env.VITE_FRONTEND_ROOT_URL || 'http://localhost:4200',

  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'srk-univeristy.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'srk-univeristy',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'srk-univeristy.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '746575375955',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:746575375955:web:bbb261d549a33cc96860a6',
  },

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

export default env;
