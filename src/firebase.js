import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGSQVydDGlJ_-DMb5x7Ibhx2frwrrR3MA",
  authDomain: "myshope-1ff26.firebaseapp.com",
  projectId: "myshope-1ff26",
  storageBucket: "myshope-1ff26.firebasestorage.app",
  messagingSenderId: "345118955736",
  appId: "1:345118955736:web:fcbc843c27751c596c9fad"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
