import express from "express";
import {
  createInvoice,
  getAllInvoices,
} from "../controllers/invoice.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createInvoice);
router.get("/all", verifyToken, getAllInvoices);

export default router;
