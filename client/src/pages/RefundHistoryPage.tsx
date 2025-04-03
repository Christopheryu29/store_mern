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
} from "@mui/material";
import { useEffect, useState } from "react";

interface Refund {
  _id: string;
  item: { name: string };
  quantityReturned: number;
  refundAmount: number;
  reason: string;
  returnedBy: { username: string };
  createdAt: string;
}

export default function RefundHistoryPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/refund", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setRefunds(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading refunds...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Refund History
        </Typography>

        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Qty Returned</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Returned By</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.item.name}</TableCell>
                <TableCell>{r.quantityReturned}</TableCell>
                <TableCell>${r.refundAmount.toFixed(2)}</TableCell>
                <TableCell>{r.reason}</TableCell>
                <TableCell>{r.returnedBy.username}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
