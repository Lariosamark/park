import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ViewLogs() {
  const [applications, setApplications] = useState([]); // State to hold applications
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const appsCollection = collection(db, "applications");
        const snapshot = await getDocs(appsCollection);
        const appsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setApplications(appsData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "applications", id));
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== id)
      );
      setSnackbarMessage("Application deleted successfully.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting application:", error);
      setSnackbarMessage("Error deleting application.");
      setOpenSnackbar(true);
    }
  };

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
              <TableCell>Email</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Parking Spot ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No applications submitted.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.vehicleNumber}</TableCell>
                  <TableCell>{app.parkingSpotId}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(app.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
