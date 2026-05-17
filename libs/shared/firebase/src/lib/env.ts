/// <reference types="vite/client" />

/**
 * Environment variables configuration for Shared Firebase
 * All variables must be prefixed with VITE_ to be accessible in the browser
 */

export const env = {
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
      'srk-univeristy.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'srk-univeristy',
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      'srk-univeristy.firebasestorage.app',
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '746575375955',
    appId:
      import.meta.env.VITE_FIREBASE_APP_ID ||
      '1:746575375955:web:bbb261d549a33cc96860a6',
  },

  // Environment
  // Build-time production flag (Vite)
  isProduction: import.meta.env.PROD,
  // Runtime/configurable production flag (supports VITE_IS_PROD or IS_PROD)
  isProdFlag:
    import.meta.env?.VITE_IS_PROD === 'true' ||
    import.meta.env?.VITE_IS_PROD === '1' ||
    import.meta.env?.IS_PROD === 'true' ||
    import.meta.env?.IS_PROD === '1' ||
    Boolean(import.meta.env.PROD),
  mode: import.meta.env.MODE,
} as const;
