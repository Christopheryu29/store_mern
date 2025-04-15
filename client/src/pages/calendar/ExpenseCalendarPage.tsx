import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  dueDate: string;
  type: "expense" | "debt";
  storeName?: string;
  note?: string;
}

export default function ExpenseCalendarPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<"all" | "expense" | "debt">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    storeName: "",
    note: "",
  });

  useEffect(() => {
    fetch("/api/expense", { credentials: "include" })
      .then((res) => res.json())
      .then(setExpenses);
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        dueDate: selectedDate,
      }),
    });

    if (res.ok) {
      const newExp = await res.json();
      setExpenses((prev) => [...prev, newExp]);
      setForm({
        title: "",
        amount: "",
        type: "expense",
        storeName: "",
        note: "",
      });
    }
  };

  // 🔍 Filter logic
  const filtered = expenses.filter((e) => {
    const sameDay =
      new Date(e.dueDate).toDateString() === selectedDate.toDateString();

    const typeMatch = filterType === "all" || e.type === filterType;

    const text = (e.title + " " + (e.storeName || "")).toLowerCase();
    const searchMatch = text.includes(searchTerm.toLowerCase());

    return sameDay && typeMatch && searchMatch;
  });

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Calendar - Debts & Expenses
        </Typography>

        <Box mt={4}>
          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
          />
        </Box>

        {/* 🔎 Filter Controls */}
        <Box display="flex" gap={2} flexWrap="wrap" mt={4}>
          <TextField
            select
            label="Filter by Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="debt">Debt</MenuItem>
          </TextField>

          <TextField
            label="Search by Title / Store"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* 📅 Filtered List */}
        <Typography mt={3} variant="h6">
          Entries on {selectedDate.toDateString()}:
        </Typography>
        <List>
          {filtered.length === 0 && <Typography>No entries.</Typography>}
          {filtered.map((e) => (
            <ListItem key={e._id}>
              <ListItemText
                primary={`${e.type.toUpperCase()}: ${e.title} - $${e.amount}`}
                secondary={
                  e.type === "debt"
                    ? `Store: ${e.storeName}`
                    : e.note || "No notes"
                }
              />
            </ListItem>
          ))}
        </List>

        {/* ➕ Entry Form */}
        <Typography mt={4} variant="h6">
          Add New Entry
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <TextField
            select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="debt">Debt</MenuItem>
          </TextField>
          {form.type === "debt" && (
            <TextField
              label="Store Name"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            />
          )}
          <TextField
            label="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
