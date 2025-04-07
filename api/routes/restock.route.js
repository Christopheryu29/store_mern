import express from "express";
import { getLowStockItems } from "../controllers/restock.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, verifyOwner, getLowStockItems);

export default router;
