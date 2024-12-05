import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Paper, Box, Divider, Button } from "@mui/material";
import { List as ListIcon } from "lucide-react";
import { db } from "../../lib/firebase"; // Adjust this import to your firebase configuration
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VisitorsList() {
  const [visitors, setVisitors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        // Fetch visitors data from Firestore
        const querySnapshot = await getDocs(collection(db, "visitors"));
        const visitorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVisitors(visitorsData);
      } catch (error) {
        console.error("Error fetching visitors data: ", error);
      }
    };

    fetchVisitors();
  }, []);

  const handleClick = (id) => {
    // Navigate to the specific visitor's page using doc id
    navigate(`/dashboard/Visitors/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", paddingTop: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <ListIcon size={24} style={{ marginRight: 8 }} /> Visitors List
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        
        {visitors.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", color: "text.secondary" }}>
            No visitors found.
          </Typography>
        ) : (
          <List>
            {visitors.map((visitor) => (
              <ListItem
                button
                key={visitor.id}
                onClick={() => handleClick(visitor.id)}
                sx={{
                  marginBottom: 2,
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: "primary.light",
                    boxShadow: 3
                  },
                }}
              >
                <ListItemText
                  primary={`${visitor.firstName} ${visitor.lastName}`}
                  secondary={visitor.contactNumber} // Use 'contactNumber' instead of 'phoneNumber'
                  sx={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        )}
        
        {visitors.length === 0 && (
          <Box sx={{ textAlign: "center", marginTop: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/dashboard/Visitors/")}
              sx={{ width: "100%" }}
            >
              Add a Visitor
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
