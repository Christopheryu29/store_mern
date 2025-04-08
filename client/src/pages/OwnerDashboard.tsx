import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  ButtonBase,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import {
  Inventory2,
  ReceiptLong,
  Group,
  Upload,
  Paid,
  Assignment,
  CalendarMonth,
  Restore,
  History,
  BrandingWatermark,
} from "@mui/icons-material";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Owner Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" mb={4}>
          Manage your business operations, sales, staff, and financials.
        </Typography>

        <Grid container spacing={3}>
          {/* Inventory & Sales */}
          <DashboardTile
            title="Manage Inventory"
            icon={<Inventory2 fontSize="large" />}
            onClick={() => navigate("/inventory")}
          />
          <DashboardTile
            title="Checkout"
            icon={<Upload fontSize="large" />}
            onClick={() => navigate("/checkout")}
          />
          <DashboardTile
            title="Sales Reports"
            icon={<ReceiptLong fontSize="large" />}
            onClick={() => navigate("/sales")}
          />
          <DashboardTile
            title="Restock Reminder"
            icon={<Restore fontSize="large" />}
            onClick={() => navigate("/restock")}
          />

          {/* Staff & Customers */}
          <DashboardTile
            title="Manage Staff"
            icon={<Group fontSize="large" />}
            onClick={() => navigate("/staff")}
          />
          <DashboardTile
            title="Customer Profiles"
            icon={<History fontSize="large" />}
            onClick={() => navigate("/customers")}
          />

          {/* Financial & Admin */}
          <DashboardTile
            title="Financial Summary"
            icon={<Paid fontSize="large" />}
            onClick={() => navigate("/financial-summary")}
          />
          <DashboardTile
            title="Expense Calendar"
            icon={<CalendarMonth fontSize="large" />}
            onClick={() => navigate("/calendar")}
          />
          <DashboardTile
            title="Activity Log"
            icon={<Assignment fontSize="large" />}
            onClick={() => navigate("/activity-log")}
          />

          {/* Refunds & Branding */}
          <DashboardTile
            title="Refund History"
            icon={<Restore fontSize="large" />}
            onClick={() => navigate("/refund-history")}
          />
          <DashboardTile
            title="Issue Refund"
            icon={<Restore fontSize="large" />}
            onClick={() => navigate("/refund")}
          />
          <DashboardTile
            title="Invoice Branding"
            icon={<BrandingWatermark fontSize="large" />}
            onClick={() => navigate("/invoice-settings")}
          />
        </Grid>
      </Box>
    </Container>
  );
}

interface TileProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function DashboardTile({ title, icon, onClick }: TileProps) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <ButtonBase
        onClick={onClick}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 3,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            transition: "0.3s ease",
            height: 140,
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.02)",
              backgroundColor: "#f9f9f9",
            },
          }}
        >
          {icon}
          <Typography fontWeight="bold" textAlign="center">
            {title}
          </Typography>
        </Paper>
      </ButtonBase>
    </Grid>
  );
}
