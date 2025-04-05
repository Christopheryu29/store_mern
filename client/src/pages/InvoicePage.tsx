import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function InvoicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { buyerName, items, date } = location.state || {};
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((res) => res.json())
      .then(setBranding);
  }, []);

  if (!buyerName || !items) {
    return (
      <Container>
        <Typography>Invalid invoice. Please go to checkout first.</Typography>
        <Button variant="contained" onClick={() => navigate("/checkout")}>
          Back to Checkout
        </Button>
      </Container>
    );
  }

  const total = items.reduce(
    (sum: number, entry: { item: Item; quantity: number }) =>
      sum + entry.item.price * entry.quantity,
    0
  );

  const handleSubmitInvoice = async () => {
    const formattedItems = items.map(
      (entry: { item: Item; quantity: number }) => ({
        name: entry.item.name,
        quantity: entry.quantity,
        unitPrice: entry.item.price,
        subtotal: entry.item.price * entry.quantity,
      })
    );

    const res = await fetch("/api/invoice/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        buyerName,
        date,
        items: formattedItems,
        total,
      }),
    });

    if (res.ok) {
      alert("Invoice submitted and saved!");
      navigate("/sales"); // or wherever you want to go after submission
    } else {
      const err = await res.json();
      alert(`Error submitting invoice: ${err.message}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Invoice
        </Typography>

        {/* Branding Section */}
        {branding && (
          <Box
            textAlign="center"
            mb={3}
            p={2}
            sx={{ border: "1px solid #ccc", borderRadius: 2 }}
          >
            {branding.logoUrl && (
              <img
                src={branding.logoUrl}
                alt="Store Logo"
                style={{ width: 100, height: "auto", marginBottom: 8 }}
              />
            )}
            <Typography variant="h5" fontWeight="bold">
              {branding.storeName}
            </Typography>
            {branding.address && (
              <Typography variant="body1">{branding.address}</Typography>
            )}
            {branding.phone && (
              <Typography variant="body2">Phone: {branding.phone}</Typography>
            )}
          </Box>
        )}

        {/* Buyer & Date Info */}
        <Typography mt={2}>
          <strong>Buyer:</strong> {buyerName}
        </Typography>
        <Typography>
          <strong>Date:</strong> {new Date(date).toLocaleString()}
        </Typography>

        {/* Table of Items */}
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((entry: { item: Item; quantity: number }) => (
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
                <strong>${total.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Actions */}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitInvoice}
          >
            Submit Invoice
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={() =>
              navigate("/checkout", {
                state: {
                  buyerName,
                  items,
                },
              })
            }
          >
            Edit Order
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
