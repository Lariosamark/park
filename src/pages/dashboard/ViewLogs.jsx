import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  query,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust the import according to your structure
import LoadingPage from "../LoadingPage"; // A loading component for fetching data
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

export default function ViewLogs() {
  const [applications, setApplications] = useState([]); // State to hold applications
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const viewlogsCollection = collection(db, "viewlogs");
        const snapshot = await getDocs(viewlogsCollection);

        const appsData = snapshot.docs.map(async (viewlogDoc) => {
          const viewlogData = viewlogDoc.data();

          let scannedAtFormatted = "";
          if (viewlogData.timestamp) {
            scannedAtFormatted = viewlogData.timestamp.toDate().toLocaleString(); // Converts to readable date-time
          }

          let timeOutFormatted = "";
          if (viewlogData.timesOut) {  // Check if timesOut exists
            timeOutFormatted = viewlogData.timesOut.toDate().toLocaleString(); // Converts to readable date-time
          }

          const phoneNumber = String(viewlogData.phoneNumber || 'N/A');  // Fallback if null

          console.log(phoneNumber);

          return {
            id: viewlogDoc.id,
            name: viewlogData.name,
            scannedAt: scannedAtFormatted,
            phoneNumber: viewlogData.phoneNumber,
            plateNo: viewlogData.plateNumber,
            spotId: viewlogData.spotId,
            timeOut: timeOutFormatted,  // Add the timesOut field to the returned data
          };
        });

        // Wait for all promises to resolve
        const resolvedData = await Promise.all(appsData);
        setApplications(resolvedData);
      } catch (error) {
        console.error("Error fetching viewlogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) return <LoadingPage />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        View Logs
      </Typography>

      {/* Display User Applications in Table Format */}
      <Typography variant="h5" gutterBottom>
        User Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Parking Spot</TableCell>
              <TableCell>Time & Date (In)</TableCell>
              <TableCell>Time & Date (Out)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.phoneNumber}</TableCell>
                  <TableCell>{app.plateNo}</TableCell>
                  <TableCell>{app.spotId}</TableCell>
                  <TableCell>{app.scannedAt}</TableCell>
                  <TableCell>{app.timeOut}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
