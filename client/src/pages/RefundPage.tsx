import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function RefundPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("/api/item", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedItem || !quantity || !reason) {
      setMessage("Please fill in all fields.");
      return;
    }

    const res = await fetch("/api/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemId: selectedItem,
        quantity,
        reason,
      }),
    });

    if (res.ok) {
      setMessage("Refund submitted successfully.");
      setSelectedItem("");
      setQuantity(1);
      setReason("");
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Return & Refund
        </Typography>

        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            label="Select Item"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            fullWidth
          >
            {items.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name} (${item.price})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity Returned"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
            fullWidth
          />

          <TextField
            label="Reason for Return"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Button variant="contained" color="warning" onClick={handleSubmit}>
            Submit Refund
          </Button>

          {message && (
            <Typography mt={2} color="primary">
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
