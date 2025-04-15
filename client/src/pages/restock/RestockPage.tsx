import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function RestockPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(`/api/restock?threshold=${threshold}`, {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [threshold]);

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Restock Reminder
        </Typography>

        <TextField
          type="number"
          label="Low Stock Threshold"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Box textAlign="center" mt={3}>
            <CircularProgress />
            <Typography mt={2}>Checking low-stock items...</Typography>
          </Box>
        ) : items.length === 0 ? (
          <Typography>No items need restocking 🎉</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell sx={{ color: "red" }}>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Container>
  );
}
