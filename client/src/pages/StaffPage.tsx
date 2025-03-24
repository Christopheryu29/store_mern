import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { RootState } from "../redux/store";

interface Staff {
  _id: string;
  username: string;
  email: string;
  role: "owner" | "cashier";
}

export default function StaffPage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({
    username: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const [editState, setEditState] = useState<Record<string, Staff>>({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/");
    } else {
      fetchStaff();
    }
  }, [currentUser, navigate]);

  const fetchStaff = async () => {
    const res = await fetch("/api/user/all");
    const data = await res.json();
    setStaff(data);
  };

  const handleCreateUser = async () => {
    await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStaff),
    });
    setNewStaff({ username: "", email: "", password: "", role: "cashier" });
    fetchStaff();
  };

  const handleRemoveStaff = async (id: string) => {
    await fetch(`/api/user/delete/${id}`, { method: "DELETE" });
    setStaff(staff.filter((s) => s._id !== id));
  };

  const handleEditChange = (id: string, key: keyof Staff, value: string) => {
    setEditState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleUpdateUser = async (id: string) => {
    const update = editState[id];
    await fetch(`/api/user/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Important for sending the JWT cookie!
      body: JSON.stringify({
        username: update.username,
        email: update.email,
        role: update.role,
      }),
    });

    fetchStaff();
    setEditState((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold">
          Staff Management
        </Typography>

        <Box
          mt={4}
          display="flex"
          gap={2}
          flexWrap="wrap"
          justifyContent="center"
        >
          <TextField
            label="Username"
            value={newStaff.username}
            onChange={(e) =>
              setNewStaff({ ...newStaff, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            value={newStaff.email}
            onChange={(e) =>
              setNewStaff({ ...newStaff, email: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            value={newStaff.password}
            onChange={(e) =>
              setNewStaff({ ...newStaff, password: e.target.value })
            }
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newStaff.role}
              label="Role"
              onChange={(e) =>
                setNewStaff({
                  ...newStaff,
                  role: e.target.value as "owner" | "cashier",
                })
              }
            >
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            color="primary"
          >
            Add Staff
          </Button>
        </Box>

        <Table sx={{ mt: 5 }}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((member) => {
              const isEditing = !!editState[member._id];
              const editable = editState[member._id] || member;

              return (
                <TableRow key={member._id}>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editable.username}
                        onChange={(e) =>
                          handleEditChange(
                            member._id,
                            "username",
                            e.target.value
                          )
                        }
                        size="small"
                      />
                    ) : (
                      member.username
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editable.email}
                        onChange={(e) =>
                          handleEditChange(member._id, "email", e.target.value)
                        }
                        size="small"
                      />
                    ) : (
                      member.email
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={editable.role}
                        onChange={(e) =>
                          handleEditChange(member._id, "role", e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="owner">Owner</MenuItem>
                        <MenuItem value="cashier">Cashier</MenuItem>
                      </Select>
                    ) : (
                      member.role
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateUser(member._id)}
                      >
                        Update
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            setEditState((prev) => ({
                              ...prev,
                              [member._id]: { ...member },
                            }))
                          }
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        {member._id !== currentUser?._id && (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveStaff(member._id)}
                          >
                            Remove
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
