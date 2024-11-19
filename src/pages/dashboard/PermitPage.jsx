import React, { useState } from "react";
import Permit from "../../components/dashboard/Permit";
import { createNotification } from "../../lib/notification";
import { updatePermit } from "../../lib/permit";
import { useUser } from "../../providers/AuthProvider";
import LoadingPage from "../LoadingPage";
import { usePermit } from "./usePermit";
import { useParams } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel, Button, Box } from "@mui/material";

export default function PermitPage() {
  const { permitId } = useParams();
  const { user } = useUser();

  const { permit, loading, fetchPermit } = usePermit(permitId);
  const [status, setStatus] = useState(permit?.status || "Pending"); // Default status to 'Pending'

  if (loading) return <LoadingPage />;
  if (!permit) return <>No Permit</>;

  const handleUpdate = async (newStatus) => {
    await updatePermit(permit.id, { status: newStatus });
    await createNotification(
      user.id,
      permit.userId,
      `Admin ${newStatus.toLowerCase()} your request`,
      {  link: `/dashboard/mypermit` }
    );
    setStatus(newStatus); // Update local state after successful update
    fetchPermit()
  };

  const handleChange = (event) => {
    event.preventDefault();
    const selectedStatus = event.target.value;
    handleUpdate(selectedStatus);
  };

  return (
    <div>
      <Permit permitData={permit} />

      {/* Status Update Select */}
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="permit-status-label">Status</InputLabel>
          <Select
            labelId="permit-status-label"
            value={status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Declined">Declined</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
