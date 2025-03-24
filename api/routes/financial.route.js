import express from "express";
import { getFinancialSummary } from "../controllers/financial.controller.js";
import { verifyToken, verifyOwner } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/summary", verifyToken, verifyOwner, getFinancialSummary);

export default router;
