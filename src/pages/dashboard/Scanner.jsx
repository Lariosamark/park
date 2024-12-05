import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Container, Typography, Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import navigate

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleScan = (data) => {
    if (data && data.text) {
      try {
        const url = new URL(data.text);  
        const urlParams = new URLSearchParams(url.search);
        
        const userId = urlParams.get('userId'); 
        
        if (userId) {
          fetchUserData(userId); 
        } else {
          setError("Invalid QR Code: User ID missing.");
        }
      } catch (err) {
        setError("Invalid QR Code format.");
      }
    }
  };

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);

      // Check in 'users' collection first
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserInfo(userSnap.data());

        setError(null);
      } else {
        // If not found in 'users', check 'visitors' collection
        const visitorRef = doc(db, "visitors", userId);
        const visitorSnap = await getDoc(visitorRef);

        const userData = visitorSnap.data();

        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const name = firstName + ' ' + lastName;

        await setDoc(doc(db, "qrScans", userId), {
          userId: userId,
          name: name || 'Unknown', // If name exists
          email: userData.email || 'Unknown', // If email exists
          scannedAt: new Date(),
        });

        if (visitorSnap.exists()) {
          navigate(`/dashboard/parking/${userId}`); // Navigate if found in visitors
        } else {
          setError("No user found in 'users' or 'visitors' collections.");
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Network or database error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanning Error:", err);
    setError("Error scanning QR code. Please try again.");
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Scan QR Code to Fetch User Information
      </Typography>

      <Box mb={3} display="flex" flexDirection="column" alignItems="center">
        {!scannedData ? (
          <>
            <Typography variant="h6" gutterBottom>
              Please scan a QR Code:
            </Typography>
            <QrScanner
              delay={300}
              onScan={handleScan}
              onError={handleError}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setScannedData(null);
              setUserInfo(null);
              setError(null);
            }}
          >
            Scan Another QR Code
          </Button>
        )}
      </Box>

      {loading && <CircularProgress color="primary" />}

      {error && (
        <Box mb={2} color="error.main">
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      {userInfo && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" value={userInfo.firstName || ''} fullWidth disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" value={userInfo.lastName || ''} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" value={userInfo.email || ''} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Contact Number" value={userInfo.contactNumber || ''} fullWidth disabled />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
