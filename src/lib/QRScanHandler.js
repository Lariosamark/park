import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore"; // Use setDoc instead of addDoc

export default function QRScanHandler() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const saveScanData = async () => {
      const userId = searchParams.get("userId");
      const firstName = searchParams.get("firstName");
      const lastName = searchParams.get("lastName");

      const name = firstName + " " + lastName;

      const email = searchParams.get("email"); // Fixed typo (was fetching "firstName" instead of "email")
      const contactNumber = searchParams.get("contactNumber");
      const active = true;

      if (userId) {
        try {
          // Use setDoc and pass userId as document ID
          await setDoc(doc(db, "qrScans", userId), {
            userId,
            name,
            email,
            contactNumber,
            active,
            scannedAt: new Date(),
          });
          console.log("Scan data saved successfully!");
        } catch (error) {
          console.error("Error saving scan data:", error);
        }
      }
    };

    saveScanData();
  }, [searchParams]);
}
