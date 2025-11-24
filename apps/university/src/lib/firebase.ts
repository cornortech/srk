// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "srk-univeristy.firebaseapp.com",
  projectId: "srk-univeristy",
  storageBucket: "srk-univeristy.firebasestorage.app",
  messagingSenderId: "746575375955",
  appId: "1:746575375955:web:bbb261d549a33cc96860a6",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
