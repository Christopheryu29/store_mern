import express from "express";
import {
  getCustomers,
  getCustomerInvoices,
} from "../controllers/customer.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, verifyOwner, getCustomers);
router.get("/:buyerName", verifyToken, verifyOwner, getCustomerInvoices);

export default router;
