// src/lib/user.js
import { db } from './firebase'; // Ensure correct path to your Firebase configuration
import { doc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

// Fetch a single user by ID
export const getUser = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    // Check if the document exists
    if (userDoc.exists()) {
      const userData = {
        id: userDoc.id,
        ...userDoc.data(),
      };
      return userData;
    } else {
      // Document does not exist
      return null;
    }
  } catch (e) {
    // Handle any errors
    console.error("Error fetching user:", e);
    return null;
  }
};

// Fetch all users
export const getUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching users:", e);
    return [];
  }
};

// Update a user by ID
export const updateUser = async (userId, userData) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, userData);
    console.log("User updated successfully:", userId);
  } catch (e) {
    console.error("Error updating user:", e);
  }
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const userDoc = doc(db, "users", userId);
    await deleteDoc(userDoc);
    console.log("User deleted successfully:", userId);
  } catch (e) {
    console.error("Error deleting user:", e);
  }
};
