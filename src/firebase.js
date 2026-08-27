// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// You will get these exact keys from the Firebase Console when you create a project
const firebaseConfig = {
  apiKey: "AIzaSyAAGJynAfaNRjxVobLXNaeTRLyVqgBMHJI",
  authDomain: "rescuegh.firebaseapp.com",
  projectId: "rescuegh",
  storageBucket: "rescuegh.firebasestorage.app",
  messagingSenderId: "453854413602",
  appId: "1:453854413602:web:8eaee548513dcf60171b7b",
  measurementId: "G-44K8N15MFG"
};

// Initialize the Backend
const app = initializeApp(firebaseConfig);

// Export the specific services we need for your pages
export const auth = getAuth(app);         // For Login.jsx / Signup.jsx
export const db = getFirestore(app);      // For ReportEmergency.jsx
export const storage = getStorage(app);