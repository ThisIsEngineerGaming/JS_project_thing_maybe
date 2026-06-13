import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACneVXG2VPw6L34pAJ75Wd-8KuHr_E4LQ",
  authDomain: "testproj-9254d.firebaseapp.com",
  projectId: "testproj-9254d",
  storageBucket: "testproj-9254d.firebasestorage.app",
  messagingSenderId: "1065688599308",
  appId: "1:1065688599308:web:5eaf8b60bdfc27b7e5d729",
  measurementId: "G-PLVCJQ0L41"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
