import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ItemSummary {
  name: string;
  quantitySold: number;
  totalRevenue: number;
}

interface FinancialSummary {
  totalSales: number;
  dailySales: number;
  monthlySales: number;
  topItems: ItemSummary[];
}

export default function FinancialSummaryPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/financial/summary", {
          credentials: "include",
        });
        const data = await res.json();
        setSummary(data);
        setLastUpdated(new Date().toLocaleString());
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch summary", error);
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography mt={2}>Loading financial summary...</Typography>
      </Container>
    );
  }

  if (!summary) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Failed to load financial summary.
        </Typography>
      </Container>
    );
  }

  const pieData = summary.topItems.map((item) => ({
    name: item.name,
    value: item.totalRevenue,
  }));

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Financial Summary
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6">
            Total Sales: <strong>${summary.totalSales.toFixed(2)}</strong>
          </Typography>
          <Typography variant="h6" mt={1}>
            Today&apos;s Sales:{" "}
            <strong>${summary.dailySales.toFixed(2)}</strong>
          </Typography>
          <Typography variant="h6" mt={1}>
            This Month&apos;s Sales:{" "}
            <strong>${summary.monthlySales.toFixed(2)}</strong>
          </Typography>
          {lastUpdated && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight="bold">
          Top Selling Items
        </Typography>

        {summary.topItems.length === 0 ? (
          <Typography mt={2}>No sales data available.</Typography>
        ) : (
          <>
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Quantity Sold</TableCell>
                  <TableCell>Total Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.topItems.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantitySold}</TableCell>
                    <TableCell>${item.totalRevenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Top Selling Items (Pie Chart)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#8884d8",
                            "#82ca9d",
                            "#ffc658",
                            "#ff8042",
                            "#8dd1e1",
                          ][index % 5]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}
