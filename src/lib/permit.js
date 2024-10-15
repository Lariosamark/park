import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

import { db } from "./firebase"; // Ensure you import your Firebase configuration
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { uploadPermitFiles } from "./uploadHelper"; // Assume you have this helper function

export const createPermit = async (userId, permitData, requirements) => {
  try {
    // Step 1: Create a new permit request in Firestore (without file URLs initially)
    const permitRequest = {
      ...permitData,
      type: "new",
      status: "Pending",
      isExpired: false,
      createdAt: Timestamp.now(),
    };

    // Create a new document in the "permitRequests" collection
    const docRef = await addDoc(collection(db, "permits"), permitRequest);

    // Step 2: Upload the files to Firebase Storage and store their URLs
    const fileUrls = await uploadPermitFiles(requirements, docRef.id);

    // Step 3: Update the document with file URLs in the permitRequest object
    await addDoc(docRef, {
      fileUrls,
    });

    // Fetch the updated document to return the complete permitRequest
    const updatedPermitDoc = await getDoc(docRef);
    console.log("Permit request created successfully with ID:", docRef.id);
    return { id: docRef.id, ...updatedPermitDoc.data() };
  } catch (error) {
    console.error("Error creating permit request:", error);
    throw error; // Rethrow the error to handle it outside if needed
  }
};

export const getPermit = async (permitId) => {
  try {
    const permitDoc = await getDoc(doc(db, "permits", permitId));
    if (permitDoc.exists()) {
      return { id: permitDoc.id, ...permitDoc.data() };
    } else {
      console.error("No such permit exists!");
      return null; // Or throw an error if you prefer
    }
  } catch (error) {
    console.error("Error fetching permit:", error);
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
      const fileRef = ref(
        storage,
        `permitRequests/${docId}/${key}-${file.name}`
      );

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
