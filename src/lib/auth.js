import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { setDoc, doc } from "firebase/firestore";

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred.");
  }
};

export const register = async (data) => {
  try {
    const user = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const userData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      role: "User",
      isVIP: false,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", user.user.uid), userData);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred.");
  }
};