import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardMedia,
  Paper,
} from "@mui/material";

const Permit = ({ permitData }) => {
  const {
    Fullname,
    vehicleColor,
    expiryDateLicense,
    status,
    contactNo,
    designation,
    dateIssuedLicense,
    dateIssuedOR,
    isExpired,
    createdAt,
    idNumber,
    dateIssuedReg,
    vehicleType,
    fileUrls,
    driversLicenseNo,
    type,
    plateNo,
    address,
    registrationNo,
    currentORNo,
    userId,
  } = permitData;

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Permit Details
        </Typography>

        {/* Display Permit Details */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Full Name:</strong> {Fullname}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Vehicle Type:</strong> {vehicleType}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Vehicle Color:</strong> {vehicleColor}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>License Expiry Date:</strong> {expiryDateLicense}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Status:</strong> {status}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Contact No:</strong> {contactNo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Designation:</strong> {designation}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Date Issued OR:</strong> {dateIssuedOR}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Plate No:</strong> {plateNo}
            </Typography>
          </Grid>
        </Grid>

        {/* Uploaded Documents */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Uploaded Documents
          </Typography>

          <Grid container spacing={2}>
            {fileUrls?.driversLicense && (
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Driver's License
                  </Typography>
                  <CardMedia
                    component="img"
                    height="140"
                    image={fileUrls.driversLicense}
                    alt="Driver's License"
                    sx={{ objectFit: "contain" }}
                  />
                </Paper>
              </Grid>
            )}
            {fileUrls?.paymentReceipt && (
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Payment Receipt
                  </Typography>
                  <CardMedia
                    component="img"
                    height="140"
                    image={fileUrls.paymentReceipt}
                    alt="Payment Receipt"
                    sx={{ objectFit: "contain" }}
                  />
                </Paper>
              </Grid>
            )}
            {fileUrls?.officialRegistration && (
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Official Registration
                  </Typography>
                  <CardMedia
                    component="img"
                    height="140"
                    image={fileUrls.officialRegistration}
                    alt="Official Registration"
                    sx={{ objectFit: "contain" }}
                  />
                </Paper>
              </Grid>
            )}
            {fileUrls?.validID && (
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Valid ID
                  </Typography>
                  <CardMedia
                    component="img"
                    height="140"
                    image={fileUrls.validID}
                    alt="Valid ID"
                    sx={{ objectFit: "contain" }}
                  />
                </Paper>
              </Grid>
            )}
            {fileUrls?.corReceipt && (
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Certificate of Registration (COR)
                  </Typography>
                  <CardMedia
                    component="img"
                    height="140"
                    image={fileUrls.corReceipt}
                    alt="Certificate of Registration (COR)"
                    sx={{ objectFit: "contain" }}
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Permit;
