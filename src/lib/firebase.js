// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJGLTF7g98LAVJ0KQSufSyi-z-aFMF83E",
  authDomain: "park-9e055.firebaseapp.com",
  projectId: "park-9e055",
  storageBucket: "park-9e055.appspot.com",
  messagingSenderId: "874532312543",
  appId: "1:874532312543:web:1516fbae96c5cade1e206a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
