// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

const app = initializeApp(firebaseConfig);
// Note: File uploads now use Cloudflare R2 (S3) instead of Firebase Storage
