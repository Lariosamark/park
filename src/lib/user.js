import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

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