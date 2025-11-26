/**
 * Environment variables configuration for Bank App
 * All variables must be prefixed with VITE_ to be accessible in the browser
 */

export const env = {
  // API Configuration
  backendUrl: import.meta.env.VITE_BACKEND_ROOT_URL || 'http://localhost:4000',
  frontendUrl:
    import.meta.env.VITE_FRONTEND_ROOT_URL || 'http://localhost:4300',
  // MongoDB
  proPackageId: import.meta.env.VITE_PRO_PACKAGE_ID || '',

  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Type-safe environment check
export const validateEnv = () => {
  const required = [
    'VITE_BACKEND_ROOT_URL',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0 && import.meta.env.PROD) {
    console.error('Missing required environment variables:', missing);
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Validate on import in production
if (import.meta.env.PROD) {
  validateEnv();
}

export default env;
