import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function InvoiceSettingsPage() {
  const [form, setForm] = useState({
    storeName: "",
    address: "",
    phone: "",
    logoUrl: "",
  });

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Invoice settings saved!");
    } else {
      alert("Failed to save settings");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Invoice Branding Settings
        </Typography>

        <TextField
          label="Store Name"
          fullWidth
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          fullWidth
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          fullWidth
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Logo URL"
          fullWidth
          value={form.logoUrl}
          onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          helperText="Paste a logo image URL from Imgur, Cloudinary, etc."
          sx={{ mb: 3 }}
        />

        <Button variant="contained" fullWidth onClick={handleSave}>
          Save Settings
        </Button>

        {/* Preview Section */}
        <Box
          mt={5}
          p={2}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            background: "#f9f9f9",
          }}
        >
          <Typography variant="h6" mb={2}>
            Invoice Layout Preview:
          </Typography>

          {form.logoUrl && (
            <Box textAlign="center" mb={1}>
              <img
                src={form.logoUrl}
                alt="Preview Logo"
                style={{ width: 80, height: "auto", marginBottom: 8 }}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/80?text=Invalid+URL")
                }
              />
            </Box>
          )}

          <Typography textAlign="center" fontWeight="bold">
            {form.storeName || "Your Store Name"}
          </Typography>
          <Typography textAlign="center" fontSize={14}>
            {form.address || "123 Example Street"}
          </Typography>
          <Typography textAlign="center" fontSize={14}>
            {form.phone || "123-456-7890"}
          </Typography>

          <Box mt={2}>
            <Typography variant="body2">
              <strong>Buyer:</strong> John Doe
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> April 3, 2025
            </Typography>
            <Typography variant="body2">
              <strong>Items:</strong> Product A (2), Product B (1)
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> $99.99
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
