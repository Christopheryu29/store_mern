import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

interface Item {
  name: string;
  quantity: number;
}

interface Invoice {
  _id: string;
  buyerName: string;
  date: string;
  total: number;
}

interface Customer {
  buyerName: string;
  totalSpent: number;
}

interface SaleTrend {
  date: string;
  total: number;
}

interface TopItem {
  name: string;
  totalRevenue: number;
}

interface Expense {
  amount: number;
  title: string;
  dueDate: string;
  type: string;
  storeName?: string;
  note?: string;
}

export default function Home() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todaySales, setTodaySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [lowStock, setLowStock] = useState<Item[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [salesTrend, setSalesTrend] = useState<SaleTrend[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/sign-in");
      return;
    }

    const fetchSummary = async () => {
      try {
        const [salesRes, stockRes, invoiceRes, customerRes, expenseRes] =
          await Promise.all([
            fetch("/api/financial/summary", { credentials: "include" }),
            fetch("/api/restock", { credentials: "include" }),
            fetch("/api/invoice/all", { credentials: "include" }),
            fetch("/api/customer", { credentials: "include" }),
            fetch("/api/expense", { credentials: "include" }),
          ]);

        const salesData = await salesRes.json();
        const lowStockData = await stockRes.json();
        const invoicesData = await invoiceRes.json();
        const customerData = await customerRes.json();
        const expensesData = await expenseRes.json();

        setTodaySales(salesData.dailySales || 0);
        setMonthlySales(salesData.monthlySales || 0);
        setNetProfit(salesData.netProfit || 0);
        setLowStock(lowStockData || []);
        setRecentInvoices(invoicesData.slice(0, 5));
        setTopCustomers(customerData.slice(0, 5));
        setTopItems(salesData.topItems || []);
        setTotalExpenses(
          expensesData.reduce(
            (sum: number, exp: Expense) => sum + exp.amount,
            0
          )
        );

        // Calculate sales trend
        const last7Days = Array.from({ length: 7 }).map((_, i) =>
          dayjs().subtract(i, "day").startOf("day")
        );
        const trend = last7Days
          .map((d) => {
            const dayTotal = invoicesData
              .filter((inv: Invoice) => dayjs(inv.date).isSame(d, "day"))
              .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
            return { date: d.format("MMM D"), total: dayTotal };
          })
          .reverse();

        setSalesTrend(trend);
      } catch (err) {
        console.error("Error loading summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {currentUser?.username}
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          {[
            {
              label: "Today's Sales",
              value: todaySales,
              color: "success.main",
            },
            {
              label: "Monthly Sales",
              value: monthlySales,
              color: "primary.main",
            },
            { label: "Net Profit", value: netProfit, color: "error.main" },
            {
              label: "Total Expenses (This Month)",
              value: totalExpenses,
              color: "warning.main",
            },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle1">{stat.label}</Typography>
                <Typography variant="h5" color={stat.color}>
                  ${stat.value.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {/* Sales Trend */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sales Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#1976d2" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top Items */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top Selling Items
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topItems}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalRevenue" fill="#ff9800" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Low Stock */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Low Stock Items
              </Typography>
              {lowStock.length === 0 ? (
                <Typography>No low stock items.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStock.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell sx={{ color: "red" }}>
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>

          {/* Top Customers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top Customers
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topCustomers}>
                  <XAxis dataKey="buyerName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSpent" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Invoices */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Invoices
              </Typography>
              {recentInvoices.length === 0 ? (
                <Typography>No recent invoices.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Buyer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentInvoices.map((inv) => (
                      <TableRow key={inv._id}>
                        <TableCell>{inv.buyerName}</TableCell>
                        <TableCell>
                          {new Date(inv.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${inv.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
