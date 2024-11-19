import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  doc,
  getDocs,
  limit,
  updateDoc,
  setDoc,
  getDoc, // Import getDoc to fetch a single document
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase"; // Ensure you import your Firebase configuration

export const createPermit = async (userId, permitData, requirements) => {
  try {
    // Step 1: Create the permit request data (without file URLs initially)
    const permitRequest = {
      ...permitData,
      userId,
      type: "new",
      status: "Pending",
      isExpired: false,
      createdAt: Timestamp.now(),
    };

    // Set a new document in the "permits" collection with the user's ID
    const docRef = doc(db, "permits", userId); 
    await setDoc(docRef, permitRequest);

    // Step 2: Upload the files to Firebase Storage and store their URLs
    const fileUrls = await uploadPermitFiles(requirements, userId);

    // Step 3: Update the document with file URLs
    await setDoc(docRef, { ...permitRequest, fileUrls }, { merge: true });
    
    console.log("Permit request created successfully for user ID:", userId);
    return userId;
  } catch (error) {
    console.error("Error creating permit request:", error);
    throw error; // Rethrow the error to handle it outside if needed
  }
};

// Fetch a single permit for a specific user
export const getPermit = async (userId) => {
  try {
    const permitsRef = collection(db, "permits");
    const q = query(permitsRef, where("userId", "==", userId), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No permits found for this user.");
      return null; // Return null if no permit is found
    }

    // Assuming there will be only one document
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() }; // Return the single permit object
  } catch (error) {
    console.error("Error fetching permit:", error);
    throw error; // Rethrow the error to handle it outside if needed
  }
};

// Fetch a single permit by ID
export const getPermitById = async (permitId) => {
  try {
    const permitRef = doc(db, "permits", permitId);
    const permitSnap = await getDoc(permitRef);

    if (!permitSnap.exists()) {
      console.log("No such permit!");
      return null; // Return null if no permit is found
    }

    return { id: permitSnap.id, ...permitSnap.data() }; // Return the permit object
  } catch (error) {
    console.error("Error fetching permit by ID:", error);
    throw error; // Rethrow the error to handle it outside if needed
  }
};

// Fetch all permits
export const getAllPermits = async () => {
  try {
    const permitsRef = collection(db, "permits");
    const querySnapshot = await getDocs(permitsRef); // No 'where' condition, fetching all permits

    if (querySnapshot.empty) {
      console.log("No permits found.");
      return []; // Return an empty array if no permits are found
    }

    // Map over the documents and return an array of permit objects
    const permits = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return permits; // Return the list of permits
  } catch (error) {
    console.error("Error fetching all permits:", error);
    throw error; // Rethrow the error to handle it outside if needed
  }
};

// Update permit with specific fields
export const updatePermit = async (permitId, updateFields) => {
  try {
    const permitRef = doc(db, "permits", permitId);

    // Update the permit document with the fields passed in updateFields
    await updateDoc(permitRef, updateFields);

    console.log("Permit updated successfully!");
  } catch (error) {
    console.error("Error updating permit:", error);
    throw error; // Rethrow the error to handle it outside if needed
  }
};

// Helper function to upload files to Firebase Storage
const uploadPermitFiles = async (requirements, docId) => {
  const fileUrls = {};

  const fileUploadPromises = Object.keys(requirements).map(async (key) => {
    const file = requirements[key];
    if (file) {
      // Create a reference for the file in Firebase Storage
      const fileRef = ref(storage, `requirements/${docId}/${key}-${file.name}`);

      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Store the download URL in the fileUrls object
      fileUrls[key] = downloadURL;
    }
  });

  await Promise.all(fileUploadPromises);
  return fileUrls;
};
