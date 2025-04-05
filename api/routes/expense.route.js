import express from "express";
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, verifyOwner, createExpense);
router.get("/", verifyToken, verifyOwner, getAllExpenses);
router.delete("/:id", verifyToken, verifyOwner, deleteExpense);

export default router;
