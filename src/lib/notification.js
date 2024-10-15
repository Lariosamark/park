import { db } from "./firebase"; // Adjust this import to your Firebase config file
import {
  doc,
  collection,
  collectionGroup,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

export const readNotification = async (id) => {
  try {
    await updateDoc(doc(db, "notifications", id), {
      viewed: true,
      viewedAt: serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const createNotification = async (fromId, toId, message, data) => {
  try {
    await addDoc(collection(db, "notifications"), {
      fromId,
      toId,
      message,
      viewed: false,
      data,
      notifiedAt: serverTimestamp(),
    });
    return { success: true, message: "Notification created successfully." };
  } catch (error) {
    console.log(`Create Notification Error: ${error}`);
    return { success: false, message: "Error." };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);
    return { success: true, message: "Notification deleted successfully." };
  } catch (error) {
    console.log(`Delete Notification Error: ${error}`);
    return { success: false, message: "Error deleting notification." };
  }
};
