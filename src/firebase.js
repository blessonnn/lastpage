import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase config from the Firebase Console
// Go to Firebase Console > Project Settings > General > Your apps > Web app config
const firebaseConfig = {
  apiKey: "AIzaSyCGpFbPoj5G8SM5EvQXmRUbKcukW2fYoog",
  authDomain: "lastnotee-28810.firebaseapp.com",
  databaseURL: "https://lastnotee-28810-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lastnotee-28810",
  storageBucket: "lastnotee-28810.firebasestorage.app",
  messagingSenderId: "1049971392339",
  appId: "1:1049971392339:web:bd701811d45fdb45aa6ba6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
