import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../providers/AuthProvider";
import { TextField, Button, Container, Typography, Grid, Box } from "@mui/material";
import QRCode from "react-qr-code"; // QR code component for generating QR code
import html2canvas from "html2canvas"; // Import html2canvas to capture SVG and convert to image

export default function ProfilePage() {
  const { user } = useUser(); // Get user data from AuthProvider
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
  });
  const [generatedCode, setGeneratedCode] = useState(""); // Store the generated code for QR
  const qrCodeRef = useRef(null); // Reference for the QR code component

  // Update profileData when user object changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
      });
    }
  }, [user]);

  // Handle changes in profile data input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save profile data after edit
  const handleSave = () => {
    console.log("Profile updated:", profileData);
    setEditMode(false);
  };

  // Generate a code (in this case, the user's ID) for QR code
  const generateCode = () => {
    console.log("User object:", user); // Debugging: Log the entire user object to check its structure
    if (user && user.id) {
      const userId = user.id; // Use user.id instead of user.uid
      console.log("Generated User ID:", userId); // Debugging: Log the actual user ID
      setGeneratedCode(userId); // Set the generated code (user ID) for QR code
    } else {
      console.error("User ID is not available.");
    }
  };

  // Function to download the QR code as an image
  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      // Use html2canvas to capture the QR code SVG and convert it to a canvas
      html2canvas(qrCodeRef.current).then((canvas) => {
        const imageUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG image
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${generatedCode}_qr.png`; // Set download file name
        link.click(); // Trigger the download
      });
    }
  };

  // Check if user is available
  if (!user) {
    return <p>Loading user data...</p>;  // Display loading message while user data is being fetched
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        {editMode ? "Edit Profile" : "Profile"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={profileData.contactNumber}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
      </Grid>

      <div style={{ marginTop: "20px" }}>
        {editMode ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="contained" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button variant="contained" onClick={generateCode}>
          Generate QR Code
        </Button>
      </div>

      {/* Display QR Code if generatedCode has a value */}
      {generatedCode && (
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="h6">Generated Code (User ID):</Typography>
          <Typography variant="body1">{generatedCode}</Typography>

          {/* Render QR code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div ref={qrCodeRef}>
              <QRCode value={generatedCode} size={128} />
            </div>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "10px" }}
              onClick={downloadQRCode}
            >
              Download QR Code
            </Button>
          </div>
        </Box>
      )}

      <div style={{ marginTop: "20px" }}>
        <Typography variant="body1">
          Account Created: {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">Role: {user?.role}</Typography>
      </div>
    </Container>
  );
}
