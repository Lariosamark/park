// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzyih1OTklkfZc_KJtQ7DMzCJNf5gOAEg",
  authDomain: "capstone2-ec309.firebaseapp.com",
  projectId: "capstone2-ec309",
  storageBucket: "capstone2-ec309.appspot.com",
  messagingSenderId: "315258965853",
  appId: "1:315258965853:web:1512dab84b1bbbe1d8a2b4",
  measurementId: "G-VXRZ2LPH51",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)