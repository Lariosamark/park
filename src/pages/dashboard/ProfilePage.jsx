import React, { useState, useEffect } from "react";
import { useUser } from "../../providers/AuthProvider";
import { TextField, Button, Container, Typography, Grid, Box } from "@mui/material";
import QRCode from "react-qr-code";

export default function ProfilePage() {
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
  });
  const [generatedCode, setGeneratedCode] = useState("");

  // Make sure user is available before rendering the rest of the component
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    console.log("Profile updated:", profileData);
    setEditMode(false);
  };

  const generateCode = () => {
    const userId = user?.uid; // Use user?.uid safely
    console.log("Generated User ID:", userId); // Debugging line
    if (userId) {
      setGeneratedCode(userId);
    } else {
      console.error("User ID is not available.");
    }
  };

  if (!user) {
    return <p>Loading...</p>; // Return loading if user data is still being fetched
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
          Generate Code
        </Button>
      </div>

      {/* Display QR Code if generatedCode has a value */}
      {generatedCode && (
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="h6">Generated Code (User ID):</Typography>
          <Typography variant="body1">{generatedCode}</Typography>
          <QRCode value={generatedCode} size={128} />
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
