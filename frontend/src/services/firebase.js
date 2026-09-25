import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration template (Replace with your Firebase Console credentials if using Firebase Auth / Firestore)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCareerPlusDefaultApiKeyPlaceholder",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "careerplus-app.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "careerplus-app",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "careerplus-app.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef1234567890"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
