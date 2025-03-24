import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [buyerName, setBuyerName] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<
    { item: Item; quantity: number }[]
  >([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchItems();

    // Restore state when coming back from /invoice
    const state = location.state as {
      buyerName?: string;
      items?: { item: Item; quantity: number }[];
    };

    if (state?.buyerName) {
      setBuyerName(state.buyerName);
    }

    if (state?.items) {
      setSelectedItems(state.items);
    }
  }, []);

  const navigate = useNavigate();

  const fetchItems = async () => {
    const res = await fetch("/api/item", { credentials: "include" });
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleItem = (item: Item) => {
    const existing = selectedItems.find((s) => s.item._id === item._id);
    if (existing) {
      setSelectedItems((prev) => prev.filter((s) => s.item._id !== item._id));
    } else {
      setSelectedItems((prev) => [...prev, { item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId: string, value: number) => {
    setSelectedItems((prev) =>
      prev.map((s) => (s.item._id === itemId ? { ...s, quantity: value } : s))
    );
  };

  const isSelected = (id: string) =>
    selectedItems.some((s) => s.item._id === id);

  const handleNext = () => {
    if (!buyerName || selectedItems.length === 0) {
      alert("Please enter buyer's name and select items.");
      return;
    }

    navigate("/invoice", {
      state: {
        buyerName,
        items: selectedItems,
        date: new Date().toISOString(),
      },
    });
  };
  const handleSubmit = async () => {
    try {
      for (const entry of selectedItems) {
        const res = await fetch("/api/sale/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            itemId: entry.item._id,
            quantity: entry.quantity,
            buyerName,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          alert(`Error checking out ${entry.item.name}: ${error.message}`);
          return;
        }
      }

      alert("Checkout complete!");
      setSelectedItems([]);
      setBuyerName("");
      setShowInvoice(false);
      fetchItems(); // Refresh inventory
    } catch (err) {
      alert("Something went wrong during checkout.");
      console.error(err);
    }
  };

  const total = selectedItems.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Checkout Page
        </Typography>

        <Box mt={3}>
          <TextField
            label="Buyer's Name"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            fullWidth
          />
        </Box>

        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const selected = isSelected(item._id);
              const quantity =
                selectedItems.find((s) => s.item._id === item._id)?.quantity ??
                1;

              return (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected}
                      onChange={() => handleToggleItem(item)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      disabled={!selected}
                      inputProps={{ min: 1, max: item.quantity }}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, Number(e.target.value))
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Box mt={3} textAlign="center">
          {!showInvoice ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!buyerName || selectedItems.length === 0}
            >
              Review Invoice
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowInvoice(false)}
            >
              Back to Edit
            </Button>
          )}
        </Box>

        {showInvoice && (
          <Box mt={5}>
            <Divider />
            <Typography variant="h5" fontWeight="bold" mt={3}>
              Invoice Summary
            </Typography>
            <Typography>
              <strong>Buyer:</strong> {buyerName}
            </Typography>
            <Typography>
              <strong>Date:</strong> {new Date().toLocaleString()}
            </Typography>

            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((entry) => (
                  <TableRow key={entry.item._id}>
                    <TableCell>{entry.item.name}</TableCell>
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell>${entry.item.price}</TableCell>
                    <TableCell>${entry.item.price * entry.quantity}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>${total}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Confirm Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
