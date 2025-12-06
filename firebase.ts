import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Firebase configuration - uses environment variables if available, otherwise falls back to defaults
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCQFsbimOIB4-9JCJvQ6wwtEQL2USQ4x-Q",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "meenatchitraders-882a5.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "meenatchitraders-882a5",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "meenatchitraders-882a5.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "855019984366",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:855019984366:web:ca48228bdfc75fed5c6aff",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JW35TEEH4M"
};

console.log("🔥 Firebase Config:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
});

const app = initializeApp(firebaseConfig);
console.log("✅ Firebase app initialized");

export const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
});
console.log("✅ Firestore initialized with auto-detect long polling");

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const auth = getAuth(app);
export const storage = getStorage(app);
console.log("✅ Firebase Auth & Storage initialized");
