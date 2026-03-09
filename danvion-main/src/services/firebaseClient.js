import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Lazy load Firebase Auth only when needed (e.g., admin login)
// This prevents loading auth iframe and 36 Google cookies on every page load
export const getAuthInstance = () => {
  const { getAuth } = require("firebase/auth");
  return getAuth(app);
};

// Initialize Firestore with optimized settings
export const db = initializeFirestore(app, {
  cache: { kind: "persistent" },
});

export const storage = getStorage(app);

export default app;
