import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { usePermit } from './usePermit'; // Adjust import according to your file structure
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { db } from '../../lib/firebase'; // Adjust path as necessary
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

// Register the components
Chart.register(...registerables);

const AnalyticsPage = () => {
  const [permitsData, setPermitsData] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const [violationsData, setViolationsData] = useState([]);
  const [reportsCount, setReportsCount] = useState(0);
  const { fetchPermits } = usePermit();

  useEffect(() => {
    const unsubscribeReports = onSnapshot(collection(db, "reports"), (snapshot) => {
      setReportsCount(snapshot.docs.length);
    });

    const unsubscribePermits = onSnapshot(collection(db, "permits"), (snapshot) => {
      const permits = snapshot.docs.map(doc => doc.data());
      setPermitsData(permits);
    });

    const unsubscribeParking = onSnapshot(collection(db, "parking"), (snapshot) => {
      setParkingData(snapshot.docs.map(doc => doc.data()));
    });

    const unsubscribeViolations = onSnapshot(collection(db, "violations"), (snapshot) => {
      setViolationsData(snapshot.docs.map(doc => doc.data()));
    });

    // Cleanup function to unsubscribe from snapshots
    return () => {
      unsubscribeReports();
      unsubscribePermits();
      unsubscribeParking();
      unsubscribeViolations();
    };
  }, []);

  // Process data for Bar chart
  const vehicleTypes = {};
  permitsData.forEach(permit => {
    const { vehicleType } = permit;
    vehicleTypes[vehicleType] = (vehicleTypes[vehicleType] || 0) + 1;
  });

  const barChartData = {
    labels: Object.keys(vehicleTypes),
    datasets: [
      {
        label: 'Number of Permits by Vehicle Type',
        data: Object.values(vehicleTypes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Process data for Pie chart
  const statusCounts = { New: 0, Renewal: 0, Expired: 0 };
  permitsData.forEach(permit => {
    statusCounts[permit.status] = (statusCounts[permit.status] || 0) + 1;
  });

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  // Summary data
  const totalPermits = permitsData.length;
  const totalParking = parkingData.length;
  const totalViolations = violationsData.length;

  // Print function
  const handlePrint = () => {
    const printContent = `
      <h2>Parking System Analytics Report</h2>
      <p><strong>Total Permits:</strong> ${totalPermits}</p>
      <p><strong>Total Parking Entries:</strong> ${totalParking}</p>
      <p><strong>Total Violations:</strong> ${totalViolations}</p>
      <p><strong>Total Reports Submitted:</strong> ${reportsCount}</p>
      <h3>Permits by Vehicle Type</h3>
      <ul>
        ${Object.entries(vehicleTypes).map(([type, count]) => `<li>${type}: ${count}</li>`).join('')}
      </ul>
      <h3>Permit Status Distribution</h3>
      <ul>
        ${Object.entries(statusCounts).map(([status, count]) => `<li>${status}: ${count}</li>`).join('')}
      </ul>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2, h3 { color: #333; }
            ul { list-style-type: none; padding: 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Parking System Analytics
      </Typography>
      <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginBottom: '16px' }}>
        Print Summary Report
      </Button>

      {/* Summary Report Section */}
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h6">Summary Report</Typography>
        <Typography variant="body1">
          <strong>Total Permits:</strong> {totalPermits}
        </Typography>
        <Typography variant="body1">
          <strong>Total Parking Entries:</strong> {totalParking}
        </Typography>
        <Typography variant="body1">
          <strong>Total Violations:</strong> {totalViolations}
        </Typography>
        <Typography variant="body1">
          <strong>Total Reports Submitted:</strong> {reportsCount}
        </Typography>
        <Typography variant="body1">
          <strong>Total Vehicle Types:</strong> {Object.keys(vehicleTypes).length}
        </Typography>
        <Typography variant="body1">
          <strong>Permits by Vehicle Type:</strong>
        </Typography>
        <ul>
          {Object.entries(vehicleTypes).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
        <Typography variant="body1">
          <strong>Permit Status Distribution:</strong>
        </Typography>
        <ul>
          {Object.entries(statusCounts).map(([status, count]) => (
            <li key={status}>{status}: {count}</li>
          ))}
        </ul>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Permits by Vehicle Type</Typography>
            <Bar data={barChartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Permit Status Distribution</Typography>
            <Pie data={pieChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
