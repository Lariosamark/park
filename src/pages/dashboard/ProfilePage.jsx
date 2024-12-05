import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../providers/AuthProvider";
import { TextField, Button, Container, Typography, Grid, Box } from "@mui/material";
import QRCode from "react-qr-code"; // QR code component for generating QR code
import html2canvas from "html2canvas"; // Import html2canvas to capture SVG and convert to image
import PermitForm from "../../components/dashboard/PermitForm";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

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
  const navigate = useNavigate();
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

  
  // Generate a code (in this case, the user's full information) for QR code
  const generateCode = () => {
    if (user && user.id) {
      const userData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        contactNumber: profileData.contactNumber,
      };
      // const userDataString = JSON.stringify(userData); 

      const qrUrl = `https://curly-space-acorn-v57p67wwx472pqgp-5173.app.github.dev/scan?userId=${user.id}&firstName=${encodeURIComponent(profileData.firstName)}&lastName=${encodeURIComponent(profileData.lastName)}&email=${encodeURIComponent(profileData.email)}&contactNumber=${profileData.contactNumber}`;

      setGeneratedCode(qrUrl); 
      checkUserActiveStatus();

    } else {
      console.error("User data is not available.");
    }
  };

  const checkUserActiveStatus = () => {
    if (user && user.id) {
      const userRef = doc(db, "qrScans", user.id);
  
      // Real-time listener for user document
      const unsubscribe = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.active) {
            console.log("User is active, redirecting to parking...");
            unsubscribe(); // Unsubscribe to stop listening once user is active
            navigate(`/dashboard/parking/${user.id}`); // Redirect to parking page
          } else {
            console.log("User is not active, please scan QR code to activate.");
          }
        } else {
          console.log("User data not found in Firestore.");
        }
      });
    }
  };


  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      // Use html2canvas to capture the QR code SVG and convert it to a canvas
      html2canvas(qrCodeRef.current).then((canvas) => {
        const imageUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG image
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${profileData.firstName}_${profileData.lastName}_qr.png`; // Set download file name
        link.click(); // Trigger the download
      });
    }
  };

  // Check if user is available
  if (!user) {
    return <p>Loading user data...</p>; // Display loading message while user data is being fetched
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
          Click QR Code
        </Button>
      </div>

      {/* Display QR Code if generatedCode has a value */}
      {generatedCode && (
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="h6"> QrCode:</Typography>
  

          {/* Render QR code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div ref={qrCodeRef}>
              <QRCode value={generatedCode} size={360} />
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
