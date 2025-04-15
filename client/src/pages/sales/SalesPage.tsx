import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RootState } from "../../redux/store";

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

interface Branding {
  storeName: string;
  address: string;
  phone: string;
  logoUrl: string;
}

export default function SalesPage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/");
    } else {
      fetch("/api/invoice/all", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setInvoices(data));

      fetch("/api/settings", { credentials: "include" })
        .then((res) => res.json())
        .then(setBranding);
    }
  }, [currentUser, navigate]);

  const filteredInvoices = invoices.filter((inv) =>
    inv.buyerName.toLowerCase().includes(search.toLowerCase())
  );

  const grandTotal = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const handleDownloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();

    let y = 20;
    if (branding) {
      doc.setFontSize(14);
      doc.text(branding.storeName || "Store Name", 14, y);
      y += 7;
      doc.setFontSize(11);
      if (branding.address) doc.text(branding.address, 14, y);
      y += 5;
      if (branding.phone) doc.text(`Phone: ${branding.phone}`, 14, y);
      y += 10;
    }

    doc.setFontSize(12);
    doc.text(`Buyer: ${invoice.buyerName}`, 14, y);
    doc.text(`Date: ${new Date(invoice.date).toLocaleString()}`, 14, y + 7);

    autoTable(doc, {
      startY: y + 15,
      head: [["Item", "Quantity", "Unit Price", "Subtotal"]],
      body: invoice.items.map((item) => [
        item.name,
        item.quantity.toString(),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`,
      ]),
    });

    const totalY =
      (doc as jsPDF & { lastAutoTable?: { finalY?: number } })?.lastAutoTable
        ?.finalY ?? y + 60;

    doc.text(`Total: $${invoice.total.toFixed(2)}`, 14, totalY + 10);
    doc.save(
      `invoice-${invoice.buyerName}-${new Date(
        invoice.date
      ).toLocaleDateString()}.pdf`
    );
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Sales Invoices
        </Typography>

        {branding && (
          <Box mb={3} textAlign="center">
            {branding.logoUrl && (
              <img
                src={
                  branding.logoUrl.startsWith("http")
                    ? branding.logoUrl
                    : `http://localhost:3000${branding.logoUrl}`
                }
                alt="Logo"
                style={{ width: 80, marginBottom: 8 }}
              />
            )}
            <Typography fontWeight="bold" fontSize={18}>
              {branding.storeName}
            </Typography>
            <Typography>{branding.address}</Typography>
            <Typography>{branding.phone}</Typography>
          </Box>
        )}

        <TextField
          label="Search Buyer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buyer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice._id} hover>
                <TableCell>{invoice.buyerName}</TableCell>
                <TableCell>{invoice.items.length}</TableCell>
                <TableCell>
                  <Tooltip title={new Date(invoice.date).toLocaleString()}>
                    <span>{new Date(invoice.date).toLocaleDateString()}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>${invoice.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigate("/invoice", {
                        state: {
                          buyerName: invoice.buyerName,
                          items: invoice.items.map((item) => ({
                            item: {
                              _id: "",
                              name: item.name,
                              price: item.unitPrice,
                              quantity: 0,
                            },
                            quantity: item.quantity,
                          })),
                          date: invoice.date,
                        },
                      })
                    }
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => handleDownloadPDF(invoice)}
                  >
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={4}>
          <Typography variant="h6">
            Grand Total Revenue: <strong>${grandTotal.toFixed(2)}</strong>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
