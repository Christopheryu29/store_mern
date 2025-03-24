import express from "express";
import { checkout } from "../controllers/sale.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/checkout", verifyToken, checkout);

export default router;
