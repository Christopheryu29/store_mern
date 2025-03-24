import express from "express";
import {
  addItem,
  updateItem,
  deleteItem,
  getItems,
} from "../controllers/item.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, verifyOwner, addItem);
router.put("/update/:id", verifyToken, verifyOwner, updateItem);
router.delete("/delete/:id", verifyToken, verifyOwner, deleteItem);
router.get("/", verifyToken, getItems);

export default router;
