// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Use import.meta.env to access environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_API_AUTH_DOMAIN, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, 
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID, 
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase immediately (no async function)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google provider (optional customizations)
provider.setCustomParameters({
  prompt: 'select_account' // Always prompt for account selection
});

export { app, auth, provider };