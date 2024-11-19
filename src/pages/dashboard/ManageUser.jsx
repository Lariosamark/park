import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getUsers, updateUser } from "../../lib/user"; // Ensure the path is correct

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [passwordChange, setPasswordChange] = useState({ userId: "", newPassword: "" });
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  const handleAddUser = async () => {
    // Logic to add a user
    console.log("Adding user:", newUser);
    // Reset the form and close the dialog
    setNewUser({ email: "", password: "" });
    setOpenAddUserDialog(false);
    fetchUsers(); // Refresh user list
  };

  const handleChangePassword = async () => {
    // Logic to change the password for the user
    console.log("Changing password for user:", passwordChange);
    // Reset the form and close the dialog
    setPasswordChange({ userId: "", newPassword: "" });
    setOpenChangePasswordDialog(false);
    fetchUsers(); // Refresh user list
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Users ({users.length})
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddUserDialog(true)}
      >
        Add User
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setPasswordChange({ userId: user.id, newPassword: "" });
                      setOpenChangePasswordDialog(true);
                    }}
                  >
                    Change Password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={openAddUserDialog} onClose={() => setOpenAddUserDialog(false)}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUserDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordChange.newPassword}
            onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageUser;
