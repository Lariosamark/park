import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust the import according to your structure
import LoadingPage from "../LoadingPage"; // A loading component for fetching data
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  TextField, // Import TextField for the search input
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function ViewLogs() {
  const [applications, setApplications] = useState([]); // State to hold applications
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [sortBy, setSortBy] = useState("scannedAt"); // Default to sorting by scannedAt

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const viewlogsCollection = collection(db, "viewlogs");
        const snapshot = await getDocs(viewlogsCollection);

        const appsData = snapshot.docs.map(async (viewlogDoc) => {
          const viewlogData = viewlogDoc.data();

          let scannedAtFormatted = "";
          if (viewlogData.timestamp) {
            scannedAtFormatted = viewlogData.timestamp.toDate().toLocaleString(); // Converts to readable date-time
          }

          let timeOutFormatted = "";
          if (viewlogData.timesOut) {  // Check if timesOut exists
            timeOutFormatted = viewlogData.timesOut.toDate().toLocaleString(); // Converts to readable date-time
          }

          const phoneNumber = String(viewlogData.phoneNumber || 'N/A');  // Fallback if null
          const designation = String(viewlogData.designation || 'N/A');

          return {
            id: viewlogDoc.id,
            name: viewlogData.name,
            scannedAt: scannedAtFormatted,
            phoneNumber: viewlogData.phoneNumber,
            plateNo: viewlogData.plateNumber,
            spotId: viewlogData.spotId,
            timeOut: timeOutFormatted,  // Add the timesOut field to the returned data
            designation: viewlogData.designation, // Add designation
          };
        });

        // Wait for all promises to resolve
        const resolvedData = await Promise.all(appsData);
        setApplications(resolvedData);
      } catch (error) {
        console.error("Error fetching viewlogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the applications based on the search query
  const filteredApplications = applications.filter((app) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      (app.name?.toLowerCase().includes(lowercasedQuery) || '') ||
      (app.phoneNumber?.toLowerCase().includes(lowercasedQuery) || '') ||
      (app.plateNo?.toLowerCase().includes(lowercasedQuery) || '') ||
      (app.spotId?.toLowerCase().includes(lowercasedQuery) || '') ||
      (app.designation?.toLowerCase().includes(lowercasedQuery) || '')  // Added designation for searching
    );
  });

  // Sorting the applications based on selected sort criteria
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    return valA > valB ? 1 : -1; // Ascending order
  });

  if (loading) return <LoadingPage />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        View Logs
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px" }} // Add some space below the search input
      />

      {/* Dropdown for Sorting */}
      <FormControl fullWidth style={{ marginBottom: "20px" }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="scannedAt">Time & Date (In)</MenuItem>
          <MenuItem value="timeOut">Time & Date (Out)</MenuItem>
        </Select>
      </FormControl>

      {/* Display User Applications in Table Format */}
      <Typography variant="h5" gutterBottom>
        User Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell>Parking Spot</TableCell>
              <TableCell>Time & Date (In)</TableCell>
              <TableCell>Time & Date (Out)</TableCell>
              <TableCell>Designation</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              sortedApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.phoneNumber}</TableCell>
                  <TableCell>{app.plateNo}</TableCell>
                  <TableCell>{app.spotId}</TableCell>
                  <TableCell>{app.scannedAt}</TableCell>
                  <TableCell>{app.timeOut}</TableCell>
                  <TableCell>{app.designation}</TableCell> 
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}``