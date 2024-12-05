import React, { useState } from 'react';
import QRScanner from 'react-qr-scanner';  // Library for QR scanning
import axios from 'axios';  // For making API requests
import { Container, Typography, Box, Button, Grid, TextField } from '@mui/material';

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState(null);  // Store scanned QR data
  const [userInfo, setUserInfo] = useState(null);  // Store fetched user data
  const [error, setError] = useState(null);  // Store error messages
  const [scanning, setScanning] = useState(false);  // Control scanning state

  // Handle the scanned QR code data
  const handleScan = async (data) => {
    if (data) {
      setScanning(false);  // Stop scanning once the code is found
      const userId = data;  // Assuming the QR code contains the userId
      console.log("Scanned User ID: ", userId);

      // Fetch user data from your backend using the userId
      fetchUserData(userId);
    }
  };

  // Handle scanning error
  const handleError = (error) => {
    console.error("Error scanning QR Code:", error);
    setError("Error scanning QR code. Please try again.");
  };

  // Fetch user data based on user ID
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      setUserInfo(response.data);  // Save user data from API
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again.");
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Scan QR Code to Fetch User Information
      </Typography>

      <Box style={{ marginBottom: '20px' }}>
        {/* Display scanning button or QR scanner */}
        {!scanning ? (
          <Button variant="contained" color="primary" onClick={() => setScanning(true)}>
            Start Scanning QR Code
          </Button>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Scan the QR Code to Fetch User Information:
            </Typography>
            <QRScanner
              delay={300}
              style={{ width: '100%' }}
              onScan={handleScan}
              onError={handleError}
            />
          </>
        )}
      </Box>

      {/* Display any scanning errors */}
      {error && (
        <Box style={{ marginBottom: '20px', color: 'red' }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      {/* Display fetched user information */}
      {userInfo && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" value={userInfo.firstName} fullWidth disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" value={userInfo.lastName} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" value={userInfo.email} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Contact Number" value={userInfo.contactNumber} fullWidth disabled />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
