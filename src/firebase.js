import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase config from the Firebase Console
// Go to Firebase Console > Project Settings > General > Your apps > Web app config
const firebaseConfig = {
  apiKey: "AIzaSyAu6il46tli5jf_YlU5_yK55-gukebFe60",
  authDomain: "lastnote-5447c.firebaseapp.com",
  databaseURL: "https://lastnote-5447c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lastnote-5447c",
  storageBucket: "lastnote-5447c.firebasestorage.app",
  messagingSenderId: "511958712365",
  appId: "1:511958712365:web:f6225beb3b6a3f6d16b8a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
