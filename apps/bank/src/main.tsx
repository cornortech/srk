import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { initializeFirebaseClient, initializeApiClient } from '@srk/shared/api';
import { env } from './env';
import App from './App';

// Initialize Firebase for Bank app
initializeFirebaseClient(env.firebase);

// Initialize API client with backend URL
initializeApiClient(env.backendUrl);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
