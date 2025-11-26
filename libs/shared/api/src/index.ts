// Export API utilities
export * from './lib/apiClient';

// Firebase exports
// NOTE: firebase-admin is for backend only - import directly from './lib/firebase-admin' in backend code
// export * from './lib/firebase-admin'; // ❌ Do NOT export - causes "process is not defined" in browser
export * from './lib/firebase-client'; // For frontend (React apps)

// API endpoints
export * from './lib/api/endpoints';
export * from './lib/api/bank/bank.api';
export * from './lib/api/bank/bank.validation';
