import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { RootState } from "../redux/store";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data)); // Now includes role

      if (data.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/cashier-dashboard");
      }
    } catch (error) {
      dispatch(signInFailure((error as Error).message));
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
          Sign In
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            id="email"
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            id="password"
            onChange={handleChange}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
          <OAuth />
        </form>

        <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
          <Typography>Don't have an account?</Typography>
          <Link to="/sign-up" style={{ textDecoration: "none", marginLeft: 5 }}>
            <Typography color="primary" fontWeight="bold">
              Sign Up
            </Typography>
          </Link>
        </Box>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => dispatch(signInFailure(null))}
      >
        <Alert severity="error" onClose={() => dispatch(signInFailure(null))}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
