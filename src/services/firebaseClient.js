import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDwqUvx83Iy61mKO1G0zkTrvyQ9WiNC26E",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "danvion-ltd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "danvion-ltd",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "danvion-ltd.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "774328377216",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:774328377216:web:69b49b1ca574c2e8c4eb65",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8PV2CY2PD1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cache: { kind: "persistent" },
});
export const storage = getStorage(app);

// Suppress Firebase connection warnings by overriding console methods
const originalError = console.error;
const originalWarn = console.warn;

console.error = function (...args) {
  const errorString = args[0]?.toString?.() || "";

  // Suppress WebChannel/Network connection warnings
  if (
    errorString.includes("WebChannelConnection") ||
    errorString.includes("RPC") ||
    errorString.includes("net::ERR_INTERNET_DISCONNECTED") ||
    errorString.includes(
      "Failed to get document because the client is offline",
    ) ||
    errorString.includes("enableIndexedDbPersistence()")
  ) {
    return; // Silently suppress these warnings
  }

  // Log all other errors normally
  originalError.apply(console, args);
};

console.warn = function (...args) {
  const warnString = args[0]?.toString?.() || "";

  // Suppress Firebase deprecation warnings
  if (
    warnString.includes("enableIndexedDbPersistence()") ||
    warnString.includes("will be deprecated")
  ) {
    return; // Silently suppress deprecation warnings
  }

  // Log all other warnings normally
  originalWarn.apply(console, args);
};

export default app;
