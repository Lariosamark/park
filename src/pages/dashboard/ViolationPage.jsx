import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingPage from "../LoadingPage"; 

export default function ViolationPage() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // State for modal
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const violationsCollection = collection(db, "reports");
        const snapshot = await getDocs(violationsCollection);
        const violationsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setViolations(violationsData);
      } catch (error) {
        console.error("Error fetching violations:", error);
        setSnackbarMessage("Error fetching violations.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reports", id));
      setViolations((prevViolations) => prevViolations.filter((violation) => violation.id !== id));
      setSnackbarMessage("Violation report deleted successfully.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting violation:", error);
      setSnackbarMessage("Error deleting violation.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Handle image click to open the dialog
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageDialog(true);
  };

  // Handle dialog close
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImage("");
  };

  if (loading) return <LoadingPage />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Violation Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Violation Type</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {violations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No violations reported yet.
                </TableCell>
              </TableRow>
            ) : (
              violations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>
                    {violation.imageUrl ? (
                      <img
                        src={violation.imageUrl}
                        alt="Violation"
                        style={{ width: 100, height: 'auto', cursor: 'pointer' }} // Add cursor pointer
                        onClick={() => handleImageClick(violation.imageUrl)} // Handle image click
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell>{violation.violationType}</TableCell>
                  <TableCell>{violation.plateNumber}</TableCell>
                  <TableCell>{violation.location}</TableCell>
                  <TableCell>
                    {violation.timestamp
                      ? typeof violation.timestamp.toDate === "function"
                        ? violation.timestamp.toDate().toLocaleString()
                        : new Date(violation.timestamp).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(violation.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for displaying the clicked image */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
        <DialogTitle>Violation Image</DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Violation" style={{ width: '100%', height: 'auto' }} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
