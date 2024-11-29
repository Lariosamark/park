
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function QRScanHandler() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const saveScanData = async () => {
      const userId = searchParams.get("userId");
      const firstName = searchParams.get("firstName");
      const lastName = searchParams.get("lastName");
      const contactNumber = searchParams.get("contactNumber");

      if (userId) {
        try {
          await addDoc(collection(db, 'qrScans'), {
            userId,
            firstName,
            lastName,
            contactNumber,
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

  return <div>Processing QR Scan...</div>; 
}
