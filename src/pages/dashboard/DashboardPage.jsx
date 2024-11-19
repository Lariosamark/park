import React from "react";
import { Card, Grid, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useUser } from "../../providers/AuthProvider"; // Importing useUser hook for authentication

// Regular user dashboard
const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const features = [
    {
      title: "View Available Parking Spots",
      description: "Check real-time availability of parking spots across various locations.",
      action: "View Spots",
      href: "/dashboard/parking", // Added href for navigation
    },
    {
      title: "Apply for Parking Permit",
      description: "Submit an application for a new parking permit, or renew an existing one.",
      action: "Apply Now",
      href: "/dashboard/mypermit", // Added href for navigation
    },
    {
      title: "My Parking Permits",
      description: "View your active and expired parking permits with detailed information.",
      action: "View Permits",
      href: "/dashboard/mypermit", // Added href for navigation
    },
  ];

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome {user?.firstName} {user?.lastName || "User"}
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Parking System Dashboard
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              style={{
                padding: "20px",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{feature.title}</Typography>
              <Typography>{feature.description}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={() => navigate(feature.href)} // Navigate to the corresponding route
              >
                {feature.action}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Admin dashboard
const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const adminFeatures = [
    {
      title: "Manage Users",
      description: "View and manage users registered in the system.",
      action: "Manage Users",
      href: "/dashboard/ManageUser",
    },
    {
      title: "Manage Parking Permits",
      description: "Approve, reject, or review parking permit applications.",
      action: "View Permits",
      href: "/dashboard/permits",
    },
    {
      title: "View Logs",
      description: "Access and review system logs for monitoring and auditing.",
      action: "View Logs",
      href: "/dashboard/ViewLogs",
    },
    {
      title: "Reported Violations",
      description: "View and manage reported parking violations.",
      action: "View Violations",
      href: "/dashboard/ViolationPage",
    },
    {
      title: "View Parking Analytics",
      description: "Analyze parking data and usage trends.",
      action: "View Analytics",
      href: "/dashboard/AnalyticsPage",
    },
  ];

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome Admin {user?.firstName} {user?.lastName || "Admin"}
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Admin Dashboard - Parking System
      </Typography>
      <Grid container spacing={4}>
        {adminFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              style={{
                padding: "20px",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{feature.title}</Typography>
              <Typography>{feature.description}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={() => navigate(feature.href)} // Navigate to the corresponding route
              >
                {feature.action}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Security dashboard
const SecurityDashboard = ({ user }) => {
  const navigate = useNavigate();
  const securityFeatures = [
    {
      title: "Monitor Parking Spots",
      description: "Monitor parking spot availability across various locations.",
      action: "View Parking Spots",
      href: "/parkings", // Security route for monitoring parkings
    },
    {
      title: "QR Code Scanner",
      description: "Use QR codes to manage parking entries and exits.",
      action: "Open QR Scanner",
      href: "/scanner", // Security route for QR code scanning
    },
    {
      title: "View Parking Analytics",
      description: "Analyze parking data and usage trends.",
      action: "View Analytics",
      href: "/dashboard/AnalyticsPage",
    },
  ];

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome Security {user?.firstName} {user?.lastName || "Security"}
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Security Dashboard - Parking System
      </Typography>
      <Grid container spacing={4}>
        {securityFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              style={{
                padding: "20px",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{feature.title}</Typography>
              <Typography>{feature.description}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={() => navigate(feature.href)} // Navigate to the corresponding route
              >
                {feature.action}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Main Dashboard Page Component
export default function DashboardPage() {
  const { user } = useUser(); // Assume this is the authenticated user

  return (
    <div>
      {user?.role === "Admin" ? (
        <AdminDashboard user={user} />
      ) : user?.role === "Security" ? (
        <SecurityDashboard user={user} />
      ) : (
        <UserDashboard user={user} />
      )}
    </div>
  );
}
