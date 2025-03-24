import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { Typography, Container, Box, Button } from "@mui/material";

export default function OwnerDashboard() {
  const { currentUser } = useSelector((state: RootState) => state.user) as {
    currentUser: { role: "owner" | "cashier" } | null;
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "owner") {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold">
          Owner Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary" mt={2}>
          Manage inventory, sales, and staff permissions.
        </Typography>

        <Box mt={4} display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/inventory")}
          >
            Manage Inventory
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/sales")}
          >
            View Sales Reports
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/staff")}
          >
            Manage Staff
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/checkout")}
          >
            CheckOut Page
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/financial-summary")}
          >
            Owner Summary
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
