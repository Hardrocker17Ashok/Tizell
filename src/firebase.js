import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGSQVydDGlJ_-DMb5x7Ibhx2frwrrR3MA",
  authDomain: "myshope-1ff26.firebaseapp.com",
  projectId: "myshope-1ff26",
  storageBucket: "myshope-1ff26.appspot.com", // ✅ FIXED
  messagingSenderId: "345118955736",
  appId: "1:345118955736:web:fcbc843c27751c596c9fad"
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Auth with auto-login enabled
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ User will stay logged in even after refresh/close");
  })
  .catch((err) => {
    console.error("Persistence error:", err);
  });
