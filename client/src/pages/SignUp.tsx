import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "cashier", // Default to cashier
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Separate onChange for text inputs
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Separate onChange for Select input (Fix applied)
  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError((error as Error).message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f4f4"
    >
      <Paper
        elevation={6}
        sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 3 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Sign Up
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <TextField
            label="Username"
            variant="outlined"
            id="username"
            onChange={handleTextChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            id="email"
            onChange={handleTextChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            id="password"
            onChange={handleTextChange}
            fullWidth
            required
          />

          {/* Role Selection */}
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={formData.role} onChange={handleRoleChange}>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>
          <OAuth />
        </form>
      </Paper>
    </Box>
  );
}
