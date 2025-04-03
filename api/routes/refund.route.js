import express from "express";
import {
  createRefund,
  getAllRefunds,
} from "../controllers/refund.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, createRefund); // Staff can create
router.get("/", verifyToken, verifyOwner, getAllRefunds); // Owner can view all

export default router;
