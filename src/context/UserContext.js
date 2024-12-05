// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";  // Firebase config
import { doc, getDoc } from "firebase/firestore";

// Create a context for user
const UserContext = createContext(null);

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  
  // Assuming userId is stored when the user logs in
  useEffect(() => {
    const fetchUserId = async () => {
      const userDoc = await getDoc(doc(db, "users", "userId"));
      if (userDoc.exists()) {
        setUserId(userDoc.data().userId);  
      } else {
        console.warn("User not found!");
      }
    };
    
    fetchUserId();
  }, []);

  
};
