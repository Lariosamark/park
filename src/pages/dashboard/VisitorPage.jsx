import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { db } from '../../lib/firebase';
import { useUser } from '../../providers/AuthProvider';
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from 'firebase/firestore';
import QRCode from "react-qr-code"; // QR code component for generating QR code
import html2canvas from "html2canvas"; // Import html2canvas to capture SVG and convert to image

export default function VisitorPage() {

  const { user } = useUser(); // Get user data from AuthProvider
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    plateNumber: '',
    carColor: '',
    visitorSpot: '',
    purpose: '',
    time: '',
    date: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const qrCodeRef = useRef(null); // Reference for the QR code component

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the form data to Firestore
      const docRef = await addDoc(collection(db, 'visitors'), formData);
      
      // Display success message
      setSuccessMessage('Visitor information submitted successfully!');
      
      // Reset the form after submission
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        plateNumber: '',
        carColor: '',
        visitorSpot: '',
        purpose: '',
        time: '',
        date: '',
      });
  
      // Navigate to the visitor's details page using the document ID
      navigate(`/dashboard/Visitors/${docRef.id}`);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };
  

  

  return (
    <Container maxWidth="sm">
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/dashboard/Visitors/list')}
        sx={{ mb: 3, width: '100%' }}
      >
        Go to Visitors List
      </Button>
      <Box sx={{ mt: 0, p: 3, border: 1, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Visitor Information Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Plate Number"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Car Color"
                name="carColor"
                value={formData.carColor}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Visitor Spot"
                name="visitorSpot"
                value={formData.visitorSpot}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label=""
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label=""
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        {successMessage && (
          <Typography variant="body1" color="success" align="center" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
        {/* QR code container */}
      </Box>
    </Container>
  );
}
