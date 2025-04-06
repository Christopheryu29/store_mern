import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Customer {
  buyerName: string;
  totalSpent: number;
  orders: number;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Invoice {
  _id: string;
  buyerName: string;
  date: string;
  items: InvoiceItem[];
  total: number;
}

export default function CustomerProfilesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [minSpent, setMinSpent] = useState(0);
  const [minOrders, setMinOrders] = useState(0);

  useEffect(() => {
    fetch("/api/customer", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFiltered(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let temp = customers;

    if (search) {
      temp = temp.filter((c) =>
        c.buyerName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minSpent > 0) {
      temp = temp.filter((c) => c.totalSpent >= minSpent);
    }

    if (minOrders > 0) {
      temp = temp.filter((c) => c.orders >= minOrders);
    }

    setFiltered(temp);
  }, [search, minSpent, minOrders, customers]);

  const handleViewHistory = async (buyerName: string) => {
    setSelectedCustomer(buyerName);
    const res = await fetch(`/api/customer/${encodeURIComponent(buyerName)}`, {
      credentials: "include",
    });
    const data = await res.json();
    setInvoices(data);
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Customer Profiles
        </Typography>

        {/* Filters */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            label="Min Orders"
            type="number"
            value={minOrders}
            onChange={(e) => setMinOrders(Number(e.target.value))}
          />
          <TextField
            label="Min Total Spent"
            type="number"
            value={minSpent}
            onChange={(e) => setMinSpent(Number(e.target.value))}
          />
        </Box>

        {/* Chart */}
        <Box sx={{ height: 300 }}>
          <Typography variant="h6" mb={1}>
            Top Customers (by Total Spent)
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filtered.slice(0, 10)}
              layout="vertical"
              margin={{ left: 50, top: 10, bottom: 10 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="buyerName" type="category" />
              <Tooltip />
              <Bar dataKey="totalSpent" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Table */}
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
            <Typography mt={2}>Loading customers...</Typography>
          </Box>
        ) : (
          <Table sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Total Orders</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.buyerName}>
                  <TableCell>{customer.buyerName}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewHistory(customer.buyerName)}
                    >
                      View History
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Dialog: Order History */}
        <Dialog
          open={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Order History - {selectedCustomer}</DialogTitle>
          <DialogContent>
            {invoices.length === 0 ? (
              <Typography>No orders found.</Typography>
            ) : (
              invoices.map((invoice) => (
                <Box key={invoice._id} mb={3}>
                  <Typography>
                    <strong>Date:</strong>{" "}
                    {new Date(invoice.date).toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> ${invoice.total.toFixed(2)}
                  </Typography>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedCustomer(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
