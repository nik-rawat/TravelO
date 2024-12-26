// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

import dotenv from 'dotenv';
dotenv.config();
const { 
    FIREBASE_API_KEY, 
    FIREBASE_API_AUTH_DOMAIN, 
    FIREBASE_PROJECT_ID, 
    FIREBASE_STORAGE_BUCKET, 
    FIREBASE_MESSAGE_SENDER_ID, 
    FIREBASE_APP_ID, 
    FIREBASE_MEASUREMENT_ID 
} = process.env

// Wweb app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY, 
  authDomain: FIREBASE_API_AUTH_DOMAIN, 
  projectId: FIREBASE_PROJECT_ID, 
  storageBucket: FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: FIREBASE_MESSAGE_SENDER_ID,
  appId: FIREBASE_APP_ID, 
  measurementId: FIREBASE_MEASUREMENT_ID
};
let app;
let db;
let auth;
let provider;
let storage;

// Initialize Firebase
export const initializeFirebaseApp = async () => {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    storage = getStorage(app);
    console.log('Firebase initialized');
  } catch (error) {
    console.log(error);
  }
};

export { app, db, auth, provider, storage };