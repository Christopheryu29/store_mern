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
import { RootState } from "../redux/store";

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

export default function SalesPage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/");
    } else {
      fetch("/api/invoice/all", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setInvoices(data));
    }
  }, [currentUser, navigate]);

  const filteredInvoices = invoices.filter((inv) =>
    inv.buyerName.toLowerCase().includes(search.toLowerCase())
  );

  const grandTotal = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const handleDownloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Buyer: ${invoice.buyerName}`, 14, 30);
    doc.text(`Date: ${new Date(invoice.date).toLocaleString()}`, 14, 37);

    autoTable(doc, {
      startY: 45,
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
        ?.finalY ?? 100;

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
