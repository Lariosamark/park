import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const PermitsTable = ({ permits }) => {
  const navigate = useNavigate();

  // State for filter and search
  const [statusFilter, setStatusFilter] = useState("");
  const [searchName, setSearchName] = useState("");

  // Handle navigation to permit details
  const handleView = (permitId) => {
    navigate(`${permitId}`);
  };

  // Filtering and searching logic
  const filteredPermits = useMemo(() => {
    return permits.filter((permit) => {
      // Filter by status
      const matchesStatus =
        statusFilter === "" || permit.status === statusFilter;
      
      // Search by name
      const matchesName =
        permit.Fullname.toLowerCase().includes(searchName.toLowerCase());

      return matchesStatus && matchesName;
    });
  }, [statusFilter, searchName, permits]);

  return (
    <Paper sx={{ padding: 2 }}>
      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width: 250 }}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          variant="outlined"
          sx={{ width: 150 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Declined">Declined</MenuItem>
        </Select>
      </div>

      {/* Permits Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Permit ID</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Expiry Date License</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPermits.length > 0 ? (
              filteredPermits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell>{permit.id}</TableCell>
                  <TableCell>{permit.vehicleType}</TableCell>
                  <TableCell>{permit.expiryDateLicense}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        permit.status === "Pending"
                          ? "orange"
                          : permit.status === "Approved"
                          ? "green"
                          : "red",
                    }}
                  >
                    {permit.status}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleView(permit.userId)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No permits found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
