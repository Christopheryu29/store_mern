import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  Container,
  Avatar,
  Link as MuiLink,
  Button,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "../redux/store"; // Import RootState for TypeScript

// Define UserType explicitly
interface UserType {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "cashier"; // ✅ Role is explicitly defined
}

export default function Header() {
  const { currentUser } = useSelector((state: RootState) => state.user) as {
    currentUser: UserType | null;
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Fix: useLocation() instead of window.location.search

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#212121",
        minHeight: "56px",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "56px",
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              "&:hover": { color: "#90CAF9" },
              display: "flex",
              alignItems: "center",
            }}
          >
            Sahand
            <span style={{ color: "#90CAF9", marginLeft: 4 }}>Estate</span>
          </Typography>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#303030",
              borderRadius: "30px",
              px: 2,
              py: 0.5,
              transition: "0.3s",
              "&:hover": { backgroundColor: "#424242" },
              width: { xs: "100%", sm: "260px" },
            }}
          >
            <TextField
              variant="standard"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ disableUnderline: true }}
              sx={{
                color: "white",
                "& .MuiInputBase-input": { color: "white" },
                flexGrow: 1,
                fontSize: "14px",
                px: 1,
              }}
            />
            <IconButton type="submit" sx={{ color: "#90CAF9", p: 0.5 }}>
              <FaSearch />
            </IconButton>
          </Box>

          {/* Navigation & Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <MuiLink
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "white",
                fontSize: "15px",
                transition: "0.3s",
                "&:hover": { color: "#90CAF9" },
              }}
            >
              Home
            </MuiLink>
            <MuiLink
              component={Link}
              to="/about"
              sx={{
                textDecoration: "none",
                color: "white",
                fontSize: "15px",
                transition: "0.3s",
                "&:hover": { color: "#90CAF9" },
              }}
            >
              About
            </MuiLink>

            {/* Owner Dashboard (Only visible if user is an owner) */}
            {currentUser?.role === "owner" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/owner-dashboard")}
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  backgroundColor: "#90CAF9",
                  "&:hover": { backgroundColor: "#64B5F6" },
                }}
              >
                Owner Dashboard
              </Button>
            )}

            {/* Profile Section */}
            <IconButton onClick={() => navigate("/profile")} sx={{ p: 0 }}>
              {currentUser ? (
                <Avatar
                  src={currentUser?.avatar}
                  alt="profile"
                  sx={{
                    width: 32,
                    height: 32,
                    border: "2px solid #90CAF9",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.1)" },
                    cursor: "pointer",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #90CAF9",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#90CAF9",
                      color: "#181818",
                    },
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </Typography>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
