import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Log {
  _id: string;
  action: string;
  performedBy: { username: string; email: string };
  createdAt: string;
  metadata: any;
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Container>
        <Box mt={5} textAlign="center">
          <CircularProgress />
          <Typography mt={2}>Loading activity logs...</Typography>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Activity Log
        </Typography>

        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Performed By</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.performedBy.username}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
