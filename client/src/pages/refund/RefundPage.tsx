import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Autocomplete } from "@mui/material";

interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function RefundPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/item", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() =>
        setMessage({ type: "error", text: "Failed to fetch items." })
      );
  }, []);

  const handleSubmit = async () => {
    if (!selectedItem || quantity < 1 || !reason) {
      setMessage({
        type: "error",
        text: "Please fill in all fields correctly.",
      });
      return;
    }

    if (quantity > selectedItem.quantity) {
      setMessage({
        type: "error",
        text: "Returned quantity exceeds current stock.",
      });
      return;
    }

    setLoading(true);
    const res = await fetch("/api/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        itemId: selectedItem._id,
        quantity,
        reason,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage({ type: "success", text: "Refund submitted successfully." });
      setSelectedItem(null);
      setQuantity(1);
      setReason("");
    } else {
      setMessage({ type: "error", text: result.message || "Refund failed." });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Return & Refund
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Autocomplete
              options={items}
              getOptionLabel={(option) =>
                `${option.name} - $${option.price} (In Stock: ${option.quantity})`
              }
              renderInput={(params) => (
                <TextField {...params} label="Search & Select Item" />
              )}
              value={selectedItem}
              onChange={(_, value) => setSelectedItem(value)}
              fullWidth
            />

            <TextField
              label="Quantity Returned"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{
                min: 1,
                max: selectedItem?.quantity || 100,
              }}
              disabled={!selectedItem}
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

            {selectedItem && (
              <Typography variant="body2" color="textSecondary">
                Refund Amount: ${selectedItem.price * quantity}
              </Typography>
            )}

            <Button
              variant="contained"
              color="warning"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Refund"}
            </Button>

            {message && <Alert severity={message.type}>{message.text}</Alert>}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
