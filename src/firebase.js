import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGSQVydDGlJ_-DMb5x7Ibhx2frwrrR3MA",
  authDomain: "myshope-1ff26.firebaseapp.com",
  projectId: "myshope-1ff26",
  storageBucket: "myshope-1ff26.appspot.com",
  messagingSenderId: "345118955736",
  appId: "1:345118955736:web:fcbc843c27751c596c9fad"
};

//  Initialize Firebase App
export const app = initializeApp(firebaseConfig);

//  Firestore DB
export const db = getFirestore(app);

// Auth instance
export const auth = getAuth(app);

// Storage instance (FOR PRODUCT IMAGES)
export const storage = getStorage(app);

export const ADMIN_EMAIL = "admin@tizell.com";



setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("🔒 Session-based login enabled (no auto-login on refresh)");
  })
  .catch((err) => {
    console.error("Persistence error:", err);
  });
