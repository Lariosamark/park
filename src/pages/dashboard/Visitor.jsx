import React, { useEffect, useState, useRef } from "react";
import { Typography, Paper, Box, Divider, Card, CardContent, Grid, Button } from "@mui/material";
import { useParams } from "react-router-dom"; // For URL parameters
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code"; // QR code component for generating QR code
import html2canvas from "html2canvas"; // Import html2canvas to capture SVG and convert to image

export default function Visitor() {
  const { id } = useParams(); // Get the visitor ID from the URL
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false); // State to toggle the display of QR code
  const qrCodeRef = useRef(null); // Reference for the QR code component
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const docRef = doc(db, "visitors", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVisitor(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching visitor data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [id]);

  const generateCode = (data) => {
    const qrUrl = `https://curly-space-acorn-v57p67wwx472pqgp-5173.app.github.dev/scan?userId=${id}&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&contactNumber=${encodeURIComponent(data.phoneNumber)}`;
    return qrUrl;
  };

  const downloadQRCode = () => {
    // Use html2canvas to capture the QR code SVG and convert it to a canvas
    html2canvas(qrCodeRef.current).then((canvas) => {
      const imageUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG image
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${visitor.firstName}_${visitor.lastName}_qr.png`; // Set download file name
      link.click(); // Trigger the download
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", paddingTop: 4 }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/dashboard/Visitors/')}
        sx={{ mb: 3, width: '100%' }}
      >
        Go to Visitor Page
      </Button>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Visitor Details
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        {visitor ? (
          <Card sx={{ padding: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Name:</Typography>
                  <Typography variant="body1">{visitor.firstName} {visitor.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Phone Number:</Typography>
                  <Typography variant="body1">{visitor.phoneNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Plate Number:</Typography>
                  <Typography variant="body1">{visitor.plateNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Car Color:</Typography>
                  <Typography variant="body1">{visitor.carColor}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Visitor Spot:</Typography>
                  <Typography variant="body1">{visitor.visitorSpot}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Purpose:</Typography>
                  <Typography variant="body1">{visitor.purpose}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Time:</Typography>
                  <Typography variant="body1">{visitor.time}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Date:</Typography>
                  <Typography variant="body1">{visitor.date}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1">Visitor not found.</Typography>
        )}
        <Divider sx={{ marginTop: 3 }} />

        {/* Generate QR Code Section */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={() => setShowQRCode(!showQRCode)}
        >
          {showQRCode ? "Hide QR Code" : "Click QR Code"}
        </Button>

        {showQRCode && (
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <div ref={qrCodeRef}>
              <QRCode value={generateCode(visitor)} size={256} />
            </div>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={downloadQRCode}
            >
              Download QR Code
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
