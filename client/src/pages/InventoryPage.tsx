import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import { RootState } from "../redux/store";

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function InventoryPage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, price: 0 });
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState<Partial<Item>>({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      navigate("/");
    } else {
      fetchItems();
    }
  }, [currentUser, navigate]);

  const fetchItems = async () => {
    const res = await fetch("/api/item", { credentials: "include" });
    const data = await res.json();
    setItems(data);
  };

  const handleAddItem = async () => {
    const res = await fetch("/api/item/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newItem),
    });

    if (res.ok) {
      fetchItems();
      setNewItem({ name: "", quantity: 0, price: 0 });
    }
  };

  const handleDeleteItem = async (id: string) => {
    await fetch(`/api/item/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchItems();
  };

  const handleEditItem = (item: Item) => {
    setEditItemId(item._id);
    setEditItemData(item);
  };

  const handleSaveEdit = async () => {
    await fetch(`/api/item/update/${editItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editItemData),
    });
    setEditItemId(null);
    setEditItemData({});
    fetchItems();
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" fontWeight="bold">
          Inventory Management
        </Typography>

        <Box
          mt={3}
          display="flex"
          gap={2}
          flexWrap="wrap"
          justifyContent="center"
        >
          <TextField
            label="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
          />
          <TextField
            label="Price"
            type="number"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: Number(e.target.value) })
            }
          />
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Add Item
          </Button>
        </Box>

        <Table sx={{ mt: 5 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {editItemId === item._id ? (
                    <TextField
                      value={editItemData.name || ""}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          name: e.target.value,
                        })
                      }
                      size="small"
                    />
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item._id ? (
                    <TextField
                      type="number"
                      value={editItemData.quantity || 0}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          quantity: Number(e.target.value),
                        })
                      }
                      size="small"
                    />
                  ) : (
                    item.quantity
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item._id ? (
                    <TextField
                      type="number"
                      value={editItemData.price || 0}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          price: Number(e.target.value),
                        })
                      }
                      size="small"
                    />
                  ) : (
                    `$${item.price}`
                  )}
                </TableCell>
                <TableCell>
                  {editItemId === item._id ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => handleEditItem(item)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
