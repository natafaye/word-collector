// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU2T03numJlG7jHVLzluphFn6EBvsNKbU",
  authDomain: "word-collector-39540.firebaseapp.com",
  projectId: "word-collector-39540",
  storageBucket: "word-collector-39540.firebasestorage.app",
  messagingSenderId: "840569277063",
  appId: "1:840569277063:web:a67b8ed69ee708d1c44622"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);