import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get path parameters
import { doc, getDoc } from "firebase/firestore"; // Import getDoc to fetch data
import { db } from "../../lib/firebase";

// MUI components
import { Container, Typography, Card, CardContent, CircularProgress, Box, Button, Snackbar, Alert } from "@mui/material";

export default function ScanPage() {
  const [scanData, setScanData] = useState(null); // State to store fetched scan data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility state
  const { userId } = useParams(); // Extract userId from the URL path

  useEffect(() => {
    const fetchScanData = async () => {
      if (!userId) {
        setError("User ID is missing from URL");
        setLoading(false);
        return; // Exit early if no userId is present
      }

      console.log("Fetching scan data for userId:", userId); // Log the userId

      try {
        // Fetch scan data from Firestore
        const docRef = doc(db, "qrScans", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setScanData(docSnap.data()); // Store fetched data in state
        } else {
          setError("No scan data found for the given user ID");
        }
      } catch (error) {
        console.error("Error fetching scan data:", error);
        setError("Failed to fetch scan data");
      } finally {
        setLoading(false); // Stop loading after the request
        setOpenSnackbar(true); // Show the Snackbar with the error or success message
      }
    };

    fetchScanData();
  }, [userId]); // Trigger the effect when userId changes

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };

  return (
    <Container maxWidth="sm">
      {/* <Typography variant="h4" component="h1" align="center" gutterBottom color="primary">
        QR Scan Data
      </Typography> */}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress size={50} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Card variant="outlined" sx={{mt:10, boxShadow: 3, p: 2, bgcolor: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              User ID: {scanData.userId}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Name:</strong> {scanData.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Email:</strong> {scanData.email}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Contact Number:</strong> {scanData.contactNumber}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Active:</strong> {scanData.active ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Scanned At:</strong> {scanData.scannedAt.toDate().toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Snackbar for error/success message */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {error || "Scan data fetched successfully!"}
        </Alert>
      </Snackbar>
    </Container>
  );
}
