// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { env } from './env';

const hasFirebaseConfig = !!(env && env.firebase && env.firebase.apiKey);

let app: any = null;
export let storage: ReturnType<typeof getStorage> | null = null;
export let auth: ReturnType<typeof getAuth> | null = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
  };

  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  auth = getAuth(app);
}

export default app;
