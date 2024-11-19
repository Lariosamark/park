import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Box,
  TextField,
} from "@mui/material";
import { db } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ReportViolationPage() {
  const [violationType, setViolationType] = useState("");
  const [otherViolation, setOtherViolation] = useState(""); // State for "Other" input
  const [image, setImage] = useState(null);
  const [plateNumber, setPlateNumber] = useState("");
  const [location, setLocation] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleViolationTypeChange = (e) => {
    setViolationType(e.target.value);
    if (e.target.value !== "Other") setOtherViolation(""); // Clear "Other" input if not selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!violationType || !image || !plateNumber || !location || (violationType === "Other" && !otherViolation)) {
      setSnackbarMessage("Please fill all fields and upload an image.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const storage = getStorage();
      const imageRef = ref(storage, `violations/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const timestamp = new Date();
      const formattedTimestamp = timestamp.toLocaleString();

      const reportsCollection = collection(db, "reports");
      await addDoc(reportsCollection, {
        userId: "currentUserId", // Replace with the actual user ID
        imageUrl,
        violationType: violationType === "Other" ? otherViolation : violationType,
        plateNumber,
        location,
        timestamp: formattedTimestamp,
      });

      setSnackbarMessage("Report submitted successfully!");
      setOpenSnackbar(true);
      setViolationType("");
      setOtherViolation("");
      setImage(null);
      setPlateNumber("");
      setLocation("");
    } catch (error) {
      console.error("Error submitting report:", error);
      setSnackbarMessage("Error submitting report. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Report a Violation
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Violation Type</InputLabel>
              <Select
                value={violationType}
                onChange={handleViolationTypeChange}
                required
              >
                <MenuItem value="Parking in a No Parking Zone">Parking in a No Parking Zone</MenuItem>
                <MenuItem value="Blocking Driveway">Blocking Driveway</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Conditionally render "Other" input when "Other" is selected */}
            {violationType === "Other" && (
              <TextField
                fullWidth
                label="Specify Other Violation"
                value={otherViolation}
                onChange={(e) => setOtherViolation(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label="Plate Number"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Location of Violation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ width: '100%' }}
              />
            </Box>
            <CardActions>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Submit Report
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Error") ? "error" : "success"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
